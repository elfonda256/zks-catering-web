/*
  Warnings:

  - You are about to drop the column `paymentDeadline` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gatewayName,providerTransactionId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `totalPcs` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'IN_DELIVERY';

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- DropIndex
DROP INDEX "Payment_paymentRef_idx";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentDeadline",
ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "forfeitedAmount" INTEGER,
ADD COLUMN     "initialPaymentDueAt" TIMESTAMP(3),
ADD COLUMN     "refundAmount" INTEGER,
ADD COLUMN     "refundedAt" TIMESTAMP(3),
ADD COLUMN     "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN     "totalPcs" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "paymentChannel" TEXT,
ADD COLUMN     "paymentUrl" TEXT,
ADD COLUMN     "providerTransactionId" TEXT,
ADD COLUMN     "sessionExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_gatewayName_providerTransactionId_key" ON "Payment"("gatewayName", "providerTransactionId");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
