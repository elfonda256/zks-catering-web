-- CreateEnum
CREATE TYPE "ProductionStatus" AS ENUM ('SCHEDULED', 'PREPARING', 'COOKING', 'PACKING', 'READY', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProductionShift" AS ENUM ('MORNING', 'AFTERNOON', 'NIGHT');

-- CreateTable
CREATE TABLE "RecipeLine" (
    "id" SERIAL NOT NULL,
    "menuItemId" INTEGER NOT NULL,
    "ingredientId" INTEGER NOT NULL,
    "quantityPerPortion" DECIMAL(12,3) NOT NULL,

    CONSTRAINT "RecipeLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionOrder" (
    "id" SERIAL NOT NULL,
    "menuItemId" INTEGER NOT NULL,
    "orderId" INTEGER,
    "portions" INTEGER NOT NULL,
    "productionDate" TIMESTAMP(3) NOT NULL,
    "shift" "ProductionShift" NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "note" TEXT,
    "status" "ProductionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "materialsIssuedAt" TIMESTAMP(3),
    "createdById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodSafetyCheck" (
    "id" SERIAL NOT NULL,
    "productionOrderId" INTEGER,
    "point" TEXT NOT NULL,
    "reading" TEXT NOT NULL,
    "limit" TEXT NOT NULL,
    "ok" BOOLEAN NOT NULL,
    "checkedBy" TEXT NOT NULL,
    "createdById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FoodSafetyCheck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecipeLine_menuItemId_ingredientId_key" ON "RecipeLine"("menuItemId", "ingredientId");

-- CreateIndex
CREATE INDEX "ProductionOrder_productionDate_idx" ON "ProductionOrder"("productionDate");

-- CreateIndex
CREATE INDEX "ProductionOrder_status_idx" ON "ProductionOrder"("status");

-- CreateIndex
CREATE INDEX "FoodSafetyCheck_createdAt_idx" ON "FoodSafetyCheck"("createdAt");

-- AddForeignKey
ALTER TABLE "RecipeLine" ADD CONSTRAINT "RecipeLine_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeLine" ADD CONSTRAINT "RecipeLine_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionOrder" ADD CONSTRAINT "ProductionOrder_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionOrder" ADD CONSTRAINT "ProductionOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionOrder" ADD CONSTRAINT "ProductionOrder_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodSafetyCheck" ADD CONSTRAINT "FoodSafetyCheck_productionOrderId_fkey" FOREIGN KEY ("productionOrderId") REFERENCES "ProductionOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodSafetyCheck" ADD CONSTRAINT "FoodSafetyCheck_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
