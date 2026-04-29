import { NextRequest, NextResponse } from "next/server";

const BRANCH_MAP: { keywords: string[]; value: string }[] = [
  { keywords: ["Шагабутдинов", "Shagabutdinov", "AllergoExpress"], value: "AllergoExpress Immunolab — ул. Шагабутдинова, 132" },
  { keywords: ["Tau Sunkar", "Тау Сункар"], value: "МЦ Tau Sunkar — ул. Розыбакиева, 33А" },
  { keywords: ["New Med", "Нью Мед"], value: "МЦ New Med — г. Алматы, 1 мкр, 26а, ЖК Уштобе" },
  { keywords: ["Comfort"], value: "Comfort Clinic — пр. Серкебаева, 146/12" },
  { keywords: ["Калимолдаева"], value: "МЦ Доктор Калимолдаева — ул. Кенесары Хана, 54/11" },
  { keywords: ["LB Clinic"], value: "LB Clinic — пр. Райымбека, 540/7" },
  { keywords: ["АдкМед", "AdkMed"], value: "МЦ АдкМед — ул. Туркебаева, 257Е" },
  { keywords: ["Interteach"], value: "Interteach Clinic" },
  { keywords: ["Жасмин", "Jasmin"], value: "МЦ Жасмин — г. Каскелен, пер. Абая, 14" },
  { keywords: ["Сана", "Sana"], value: "МЦ Сана — мкр. Алмагуль, 22/2" },
  { keywords: ["TAN", "ТАН"], value: "МЦ TAN Clinic — мкрн. Таугуль, 19" },
  { keywords: ["Алгамед", "Algamed"], value: "МЦ Алгамед — пр. Абая, 157а" },
  { keywords: ["AdalMed", "Адалмед"], value: "AdalMed Clinic — пр. Абая, 115" },
  { keywords: ["Zaure", "Зауре"], value: "МЦ Dr. Zaure — мкрн. Нуркент, 9, блок 1, офис 2" },
  { keywords: ["Жан Ай Мир", "Жан-Ай-Мир"], value: "МЦ Жан-Ай-Мир — пр. Сейфуллина, 104" },
  { keywords: ["SAPA", "САПА"], value: "SAPA Lab — ул. Шагабутдинова, 169" },
];

function matchBranch(text: string): string {
  for (const branch of BRANCH_MAP) {
    for (const keyword of branch.keywords) {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        return branch.value;
      }
    }
  }
  return "";
}

function extractBranchFromText(text: string): string {
  const idx = text.indexOf("Client of study)");
  if (idx !== -1) {
    const slice = text.slice(idx, idx + 500);
    return matchBranch(slice);
  }
  return "";
}

function parseDate(raw: string): string {
  const match = raw.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (!match) return "";
  return `${match[3]}-${match[2]}-${match[1]}`;
}

function extractFromText(text: string) {
  // Test code — appears right after "The result of the study)"
  const testCodeMatch = text.match(/The result of the study\)\s*(\d{7,10})/);
  const testCode = testCodeMatch?.[1]?.trim() ?? "";

  // Name — appears after "Specimen Information)"
  const nameMatch = text.match(
  /Specimen Information\)\s*([\p{L}\s]+?)\s+(?:\d{9,12}|[МЖM]\s+\d{2}\.\d{2}\.\d{4})/u
);
  const name = nameMatch?.[1]?.trim() ?? "";

  // DOB — appears after IIN (12 digit number) and gender (М/Ж)
  const dobMatch = text.match(/(?:\d{9,12}\s+)?[МЖMmж]\s+(\d{2}\.\d{2}\.\d{4})/);
  const dob = parseDate(dobMatch?.[1] ?? "");

  // Test date — first date that appears after "The result of the study)"
  const testDateMatch = text.match(/The result of the study\)\s*\d{7,10}\s*\S+\s*(\d{2}\.\d{2}\.\d{4})/);
  const testDate = parseDate(testDateMatch?.[1] ?? "");

  // Branch
  const branch = extractBranchFromText(text);

  return { testCode, name, dob, testDate, branch };
}

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const { extractText } = await import("unpdf");
    const { text } = await extractText(new Uint8Array(buffer), { mergePages: true });
    console.log("=== FULL TEXT ===", text); // ADD THIS
    return text;
  } catch (e) {
    console.error("unpdf failed:", e);
    return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfText = await extractTextFromPdf(buffer);

    const { testCode, name, dob, testDate, branch } = extractFromText(pdfText);

    console.log("=== PARSED ===", { testCode, name, dob, testDate, branch });

    return NextResponse.json({
      testCode,
      name,
      dob,
      testDate,
      branch,
    });
  } catch (e) {
    console.error("Parse error:", e);
    return NextResponse.json({ error: "Failed to parse" }, { status: 500 });
  }
}