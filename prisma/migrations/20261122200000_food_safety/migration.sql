-- AlterTable
ALTER TABLE "FoodSafetyCheck" ADD COLUMN     "controlPoint" TEXT,
ADD COLUMN     "correctiveAction" TEXT,
ADD COLUMN     "value" DECIMAL(6,1);

-- CreateTable
CREATE TABLE "FoodSample" (
    "id" SERIAL NOT NULL,
    "productionOrderId" INTEGER NOT NULL,
    "storageLocation" TEXT NOT NULL,
    "note" TEXT,
    "storedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "keepUntil" TIMESTAMP(3) NOT NULL,
    "storedById" INTEGER,
    "disposedAt" TIMESTAMP(3),
    "disposedById" INTEGER,

    CONSTRAINT "FoodSample_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FoodSample_productionOrderId_key" ON "FoodSample"("productionOrderId");

-- CreateIndex
CREATE INDEX "FoodSample_keepUntil_idx" ON "FoodSample"("keepUntil");

-- AddForeignKey
ALTER TABLE "FoodSample" ADD CONSTRAINT "FoodSample_productionOrderId_fkey" FOREIGN KEY ("productionOrderId") REFERENCES "ProductionOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodSample" ADD CONSTRAINT "FoodSample_storedById_fkey" FOREIGN KEY ("storedById") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodSample" ADD CONSTRAINT "FoodSample_disposedById_fkey" FOREIGN KEY ("disposedById") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
