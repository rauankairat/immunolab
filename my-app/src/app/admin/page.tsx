import { getServerSession } from "@/lib/get-session";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import AdminTabs from "./AdminTabs";
import { prisma } from "@/lib/prisma";

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession();
  const user = session?.user;
  if (!user) redirect("/unauth");
  if (user.role !== "ADMIN" && user.role !== "OWNER") redirect("/unauth");

  const t = await getTranslations("admin");

  const tests = await prisma.test.findMany({
    orderBy: { testedDay: "desc" },
    select: {
      id: true,
      testCode: true,
      name: true,
      testedDay: true,
      status: true,
      location: true,
      resultUrl: true,
      resultName: true,
      walkinName: true,
      patient: {
        select: { name: true, email: true },
      },
    },
  });

  const shaped = tests.map(t2 => ({
    id: t2.id,
    testCode: t2.testCode ?? "—",
    testName: t2.name,
    patientName: t2.patient?.name ?? t2.walkinName ?? t("unknown"),
    patientEmail: t2.patient?.email ?? null,
    location: t2.location ?? "—",
    date: formatDate(t2.testedDay),
    status: t2.status as string,
    hasResult: Boolean(t2.resultUrl),
    resultUrl: t2.resultUrl ?? null,
  }));

  const ui = {
    title: t("title"),
    subtitle: t("subtitle"),
    total: t("total"),
    with_results: t("with_results"),
    tab_upload: t("tab_upload"),
    tab_tests: t("tab_tests"),
    // Upload tab
    step1_label: t("step1_label"),
    step1_registered_title: t("step1_registered_title"),
    step1_registered_sub: t("step1_registered_sub"),
    step1_walkin_title: t("step1_walkin_title"),
    step1_walkin_sub: t("step1_walkin_sub"),
    walkin_placeholder: t("walkin_placeholder"),
    search_placeholder: t("search_placeholder"),
    searching: t("searching"),
    tab_registered: t("tab_registered"),
    tab_walkin: t("tab_walkin"),
    step2_label: t("step2_label"),
    step2_title: t("step2_title"),
    step2_sub: t("step2_sub"),
    test_code_label: t("test_code_label"),
    test_code_hint: t("test_code_hint"),
    test_name_label: t("test_name_label"),
    test_name_placeholder: t("test_name_placeholder"),
    test_date_label: t("test_date_label"),
    branch_label: t("branch_label"),
    branch_placeholder: t("branch_placeholder"),
    pdf_label: t("pdf_label"),
    pdf_prompt: t("pdf_prompt"),
    pdf_sub: t("pdf_sub"),
    pdf_remove: t("pdf_remove"),
    uploading: t("uploading"),
    upload_result: t("upload_result"),
    upload_another: t("upload_another"),
    success_title: t("success_title"),
    success_sub: t("success_sub"),
    code_label: t("code_label"),
    code_hint: t("code_hint"),
    err_code: t("err_code"),
    err_fields: t("err_fields"),
    err_patient: t("err_patient"),
    err_walkin: t("err_walkin"),
    // Tests tab
    search_tests_placeholder: t("search_tests_placeholder"),
    filter_all: t("filter_all"),
    filter_upcoming: t("filter_upcoming"),
    filter_current: t("filter_current"),
    filter_past: t("filter_past"),
    col_code: t("col_code"),
    col_patient: t("col_patient"),
    col_test: t("col_test"),
    col_branch: t("col_branch"),
    col_date: t("col_date"),
    col_result: t("col_result"),
    view_pdf: t("view_pdf"),
    no_pdf: t("no_pdf"),
    no_tests: t("no_tests"),
    edit: t("edit"),
    delete: t("delete"),
    // Edit modal
    edit_title: t("edit_title"),
    field_test_name: t("field_test_name"),
    field_branch: t("field_branch"),
    field_status: t("field_status"),
    status_upcoming: t("status_upcoming"),
    status_current: t("status_current"),
    status_past: t("status_past"),
    cancel: t("cancel"),
    saving: t("saving"),
    save_changes: t("save_changes"),
    // Delete modal
    delete_title: t("delete_title"),
    delete_sub: t("delete_sub"),
    deleting: t("deleting"),
    unknown: t("unknown"),
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <h1 className={styles.headerTitle}>{ui.title}</h1>
            <p className={styles.headerSub}>{ui.subtitle}</p>
          </div>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{shaped.length}</span>
              <span className={styles.statLabel}>{ui.total}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{shaped.filter(t2 => t2.hasResult).length}</span>
              <span className={styles.statLabel}>{ui.with_results}</span>
            </div>
          </div>
        </div>
      </div>
      <AdminTabs tests={shaped} ui={ui} />
    </div>
  );
}