-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "listType" TEXT NOT NULL,
    "express" BOOLEAN NOT NULL DEFAULT false,
    "total" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
