import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import OwnerDashboard from "./OwnerDashboard";

export default async function OwnerPage() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "OWNER") redirect("/");

  const t = await getTranslations("owner");

  const [admins, patients, testStats, orders] = await Promise.all([
    prisma.user.findMany({
      where: { role: { in: ["ADMIN", "OWNER"] } },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { role: "BASIC" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        tests: {
          select: {
            id: true,
            name: true,
            status: true,
            testedDay: true,
            testCode: true,
            resultUrl: true,
            location: true,
          },
          orderBy: { testedDay: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.test.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalTests = testStats.reduce((sum, s) => sum + s._count.id, 0);
  const upcomingTests = testStats.find(s => s.status === "UPCOMING")?._count.id ?? 0;

  const stats = {
    totalPatients: patients.length,
    totalAdmins: admins.length,
    totalTests,
    upcomingTests,
    totalOrders: orders.length,
  };

  const ui = {
    badge: t("badge"),
    dashboard: t("dashboard"),
    tab_overview: t("tab_overview"),
    tab_patients: t("tab_patients"),
    tab_orders: t("tab_orders"),
    tab_admins: t("tab_admins"),
    tab_whatsapp: t("tab_whatsapp"),
    overview_title: t("overview_title"),
    overview_sub: t("overview_sub"),
    stat_patients: t("stat_patients"),
    stat_tests: t("stat_tests"),
    stat_upcoming: t("stat_upcoming"),
    stat_orders: t("stat_orders"),
    stat_admins: t("stat_admins"),
    patients_title: t("patients_title"),
    search_placeholder: t("search_placeholder"),
    unknown: t("unknown"),
    no_tests: t("no_tests"),
    col_test: t("col_test"),
    col_branch: t("col_branch"),
    col_date: t("col_date"),
    col_status: t("col_status"),
    col_result: t("col_result"),
    view_pdf: t("view_pdf"),
    orders_title: t("orders_title"),
    orders_search: t("orders_search"),
    no_orders: t("no_orders"),
    download_pdf: t("download_pdf"),
    express: t("express"),
    admins_title: t("admins_title"),
    add_admin_title: t("add_admin_title"),
    email_placeholder: t("email_placeholder"),
    role_admin: t("role_admin"),
    role_owner: t("role_owner"),
    adding: t("adding"),
    add: t("add"),
    admin_added: t("admin_added"),
    admin_add_failed: t("admin_add_failed"),
    no_name: t("no_name"),
    remove: t("remove"),
    remove_confirm: t("remove_confirm"),
    remove_failed: t("remove_failed"),
    role_update_failed: t("role_update_failed"),
    wa_title: t("wa_title"),
    wa_card_title: t("wa_card_title"),
    wa_card_sub: t("wa_card_sub"),
    wa_placeholder: t("wa_placeholder"),
    wa_saving: t("wa_saving"),
    wa_save: t("wa_save"),
    wa_saved: t("wa_saved"),
    wa_failed: t("wa_failed"),
    status_upcoming: t("status_upcoming"),
    status_current: t("status_current"),
    status_past: t("status_past"),
  };

  return (
    <OwnerDashboard
      admins={admins.map(a => ({ ...a, role: a.role as string, createdAt: a.createdAt.toISOString() }))}
      patients={patients.map(p => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        tests: p.tests.map(t2 => ({ ...t2, testedDay: t2.testedDay.toISOString() })),
      }))}
      orders={orders.map(o => ({ ...o, createdAt: o.createdAt.toISOString() }))}
      stats={stats}
      ui={ui}
    />
  );
}