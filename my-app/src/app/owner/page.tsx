import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
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

  return (
    <OwnerDashboard
      admins={admins.map(a => ({ ...a, role: a.role as string, createdAt: a.createdAt.toISOString() }))}
      patients={patients.map(p => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        tests: p.tests.map(t => ({ ...t, testedDay: t.testedDay.toISOString() })),
      }))}
      orders={orders.map(o => ({ ...o, createdAt: o.createdAt.toISOString() }))}
      stats={stats}
    />
  );
}