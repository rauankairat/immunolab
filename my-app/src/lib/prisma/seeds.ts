import { prisma } from "../prisma";

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@immunolab.app" },
    update: { name: "Demo User", age: 20 },
    create: {
      email: "demo@immunolab.app",
      name: "Demo User",
      age: 20,
      isAdmin: false,
      role: "BASIC",
    },
  });

  await prisma.test.createMany({
    data: [
      { name: "CBC Panel", testedDay: new Date(), patientId: user.id },
      { name: "CRP", testedDay: new Date(Date.now() - 86400000), patientId: user.id },
      { name: "Vitamin D", testedDay: new Date(Date.now() - 2 * 86400000), patientId: user.id },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
