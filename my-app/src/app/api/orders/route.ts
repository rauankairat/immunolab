import { NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

type Product = {
  name: string;
  description: string;
};

type OrderBody = {
  name: string;
  phone: string;
  branch: string;
  listType: string;
  express: boolean;
  total: number;
  pricePerItem: number;
  products: Product[];
};

function sanitize(str: string): string {
  return str
    .replace(/\u2019|\u2018/g, "'")
    .replace(/\u2014|\u2013/g, "-")
    .replace(/[^\x00-\x7F]/g, "?")
    .trim();
}

function truncate(str: string, max: number) {
  const s = sanitize(str);
  return s.length > max ? s.slice(0, max - 1) + "..." : s;
}

async function sendWhatsApp(pdfUrl: string, orderSummary: {
  name: string;
  phone: string;
  branch: string;
  listType: string;
  express: boolean;
  total: number;
  count: number;
}) {
  const token = process.env.META_WHATSAPP_TOKEN;
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
  const rawNumber = process.env.LAB_WHATSAPP_NUMBER ?? "";
  const labNumber = rawNumber.replace(/\s/g, "").replace(/^\+/, "");

  if (!token || !phoneNumberId || !labNumber) {
    console.warn("WhatsApp env vars missing — skipping send");
    return;
  }

  console.log("Sending WhatsApp to:", labNumber);

  // Step 1: Send hello_world template (required in sandbox)
  const templateRes = await fetch(
    `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: labNumber,
        type: "template",
        template: {
          name: "hello_world",
          language: { code: "en_US" },
        },
      }),
    }
  );

  const templateData = await templateRes.json();
  if (!templateRes.ok) {
    console.error("WhatsApp template send failed:", JSON.stringify(templateData, null, 2));
    return;
  }
  console.log("WhatsApp template sent successfully");

  // Step 2: Send PDF as document
  const docRes = await fetch(
    `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: labNumber,
        type: "document",
        document: {
          link: pdfUrl,
          filename: `order_${orderSummary.name.replace(/\s+/g, "_")}.pdf`,
          caption: `New Order — ${orderSummary.name} | ${orderSummary.branch} | ${orderSummary.count} tests | ${orderSummary.total.toLocaleString()} KZT${orderSummary.express ? " | EXPRESS" : ""}`,
        },
      }),
    }
  );

  const docData = await docRes.json();
  if (!docRes.ok) {
    console.error("WhatsApp document send failed:", JSON.stringify(docData, null, 2));
  } else {
    console.log("WhatsApp document sent successfully");
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as OrderBody;
    const { name, phone, branch, listType, express, total, pricePerItem, products } = body;

    if (!name || !phone || !branch || !products?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sName = sanitize(name);
    const sPhone = sanitize(phone);
    const sBranch = sanitize(branch);
    const sListType = sanitize(listType);

    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

    const GREEN = rgb(0.1, 0.32, 0.1);
    const LIGHT_GREEN = rgb(0.94, 0.98, 0.94);
    const GRAY = rgb(0.45, 0.45, 0.45);
    const BLACK = rgb(0, 0, 0);
    const WHITE = rgb(1, 1, 1);

    const PAGE_W = 595;
    const PAGE_H = 842;
    const MARGIN = 48;
    const COL = PAGE_W - MARGIN * 2;

    let page = doc.addPage([PAGE_W, PAGE_H]);
    let y = PAGE_H - MARGIN;

    function checkNewPage(needed = 40) {
      if (y < MARGIN + needed) {
        page = doc.addPage([PAGE_W, PAGE_H]);
        y = PAGE_H - MARGIN;
      }
    }

    page.drawRectangle({ x: 0, y: PAGE_H - 80, width: PAGE_W, height: 80, color: GREEN });
    page.drawText("AllergoExpress ImmunoLab", { x: MARGIN, y: PAGE_H - 36, size: 18, font: fontBold, color: WHITE });
    page.drawText("ORDER FORM", { x: MARGIN, y: PAGE_H - 58, size: 11, font, color: rgb(0.7, 0.9, 0.7) });

    const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    const dateW = font.widthOfTextAtSize(dateStr, 10);
    page.drawText(dateStr, { x: PAGE_W - MARGIN - dateW, y: PAGE_H - 50, size: 10, font, color: WHITE });

    y = PAGE_H - 104;

    page.drawRectangle({ x: MARGIN, y: y - 80, width: COL, height: 86, color: LIGHT_GREEN });
    page.drawText("PATIENT INFORMATION", { x: MARGIN + 14, y: y - 18, size: 8, font, color: GREEN });
    page.drawText(sName, { x: MARGIN + 14, y: y - 36, size: 15, font: fontBold, color: BLACK });
    page.drawText(sPhone, { x: MARGIN + 14, y: y - 54, size: 11, font, color: GRAY });
    page.drawText(`Branch: ${sBranch}`, { x: MARGIN + 14, y: y - 70, size: 11, font, color: GRAY });

    if (express) {
      const badgeText = "EXPRESS";
      const badgeW = fontBold.widthOfTextAtSize(badgeText, 9) + 16;
      page.drawRectangle({ x: PAGE_W - MARGIN - badgeW - 14, y: y - 56, width: badgeW, height: 22, color: rgb(0.99, 0.95, 0.88) });
      page.drawText(badgeText, { x: PAGE_W - MARGIN - badgeW - 6, y: y - 48, size: 9, font: fontBold, color: rgb(0.7, 0.4, 0) });
    }

    y -= 102;

    page.drawText(`TEST TYPE: ${sListType.toUpperCase()}`, { x: MARGIN, y, size: 9, font, color: GRAY });
    y -= 18;

    page.drawRectangle({ x: MARGIN, y: y - 22, width: COL, height: 24, color: GREEN });
    page.drawText("#", { x: MARGIN + 8, y: y - 15, size: 9, font: fontBold, color: WHITE });
    page.drawText("TEST NAME", { x: MARGIN + 30, y: y - 15, size: 9, font: fontBold, color: WHITE });
    page.drawText("PRICE", { x: PAGE_W - MARGIN - 60, y: y - 15, size: 9, font: fontBold, color: WHITE });
    y -= 28;

    products.forEach((p, i) => {
      checkNewPage(36);
      const rowBg = i % 2 === 0 ? rgb(0.98, 0.98, 0.98) : WHITE;
      page.drawRectangle({ x: MARGIN, y: y - 22, width: COL, height: 24, color: rowBg });
      page.drawText(`${i + 1}`, { x: MARGIN + 8, y: y - 15, size: 9, font, color: GRAY });
      page.drawText(truncate(p.name, 68), { x: MARGIN + 30, y: y - 15, size: 9, font, color: BLACK });
      const priceStr = `${pricePerItem.toLocaleString()} KZT`;
      const priceW = font.widthOfTextAtSize(priceStr, 9);
      page.drawText(priceStr, { x: PAGE_W - MARGIN - priceW - 8, y: y - 15, size: 9, font, color: BLACK });
      y -= 26;
    });

    checkNewPage(60);
    y -= 10;

    page.drawRectangle({ x: MARGIN, y: y - 36, width: COL, height: 38, color: GREEN });
    page.drawText("TOTAL", { x: MARGIN + 14, y: y - 22, size: 10, font: fontBold, color: WHITE });
    const totalStr = `${total.toLocaleString()} KZT`;
    const totalW = fontBold.widthOfTextAtSize(totalStr, 14);
    page.drawText(totalStr, { x: PAGE_W - MARGIN - totalW - 14, y: y - 24, size: 14, font: fontBold, color: WHITE });
    y -= 56;

    checkNewPage(40);
    page.drawText("This order form was generated automatically. Please present it at the branch.", {
      x: MARGIN, y: y - 10, size: 8, font, color: rgb(0.7, 0.7, 0.7),
    });

    const pdfBytes = await doc.save();
    const fileName = `orders/${Date.now()}_${sName.replace(/\s+/g, "_")}.pdf`;
    const blob = await put(fileName, Buffer.from(pdfBytes), {
      access: "public",
      addRandomSuffix: true,
      contentType: "application/pdf",
      token: process.env.ORDER_BLOB_READ_WRITE_TOKEN,
    });

    console.log("PDF uploaded:", blob.url);

    await sendWhatsApp(blob.url, {
      name: sName,
      phone: sPhone,
      branch: sBranch,
      listType: sListType,
      express,
      total,
      count: products.length,
    });

    return NextResponse.json({ pdfUrl: blob.url }, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/orders failed:", e);
    return NextResponse.json({ error: e?.message || "internal error" }, { status: 500 });
  }
}