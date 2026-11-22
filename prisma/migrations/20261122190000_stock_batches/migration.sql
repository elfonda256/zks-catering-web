-- AlterTable
ALTER TABLE "StockMovement" ADD COLUMN     "batchId" INTEGER;

-- CreateTable
CREATE TABLE "StockBatch" (
    "id" SERIAL NOT NULL,
    "ingredientId" INTEGER NOT NULL,
    "batchCode" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "receiptLineId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockBatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StockBatch_receiptLineId_key" ON "StockBatch"("receiptLineId");

-- CreateIndex
CREATE INDEX "StockBatch_ingredientId_expiresAt_idx" ON "StockBatch"("ingredientId", "expiresAt");

-- CreateIndex
CREATE INDEX "StockMovement_batchId_idx" ON "StockMovement"("batchId");

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "StockBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockBatch" ADD CONSTRAINT "StockBatch_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockBatch" ADD CONSTRAINT "StockBatch_receiptLineId_fkey" FOREIGN KEY ("receiptLineId") REFERENCES "GoodsReceiptLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
