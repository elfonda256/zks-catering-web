-- CreateEnum
CREATE TYPE "OrderSource" AS ENUM ('ONLINE', 'PHONE', 'WHATSAPP', 'WALK_IN');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "createdById" INTEGER,
ADD COLUMN     "source" "OrderSource" NOT NULL DEFAULT 'ONLINE';

-- CreateIndex
CREATE INDEX "Order_source_idx" ON "Order"("source");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
