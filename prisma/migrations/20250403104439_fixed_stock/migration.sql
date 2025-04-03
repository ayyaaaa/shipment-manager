/*
  Warnings:

  - You are about to drop the `invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invoiceitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sale` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_shipmentId_fkey`;

-- DropForeignKey
ALTER TABLE `invoiceitem` DROP FOREIGN KEY `InvoiceItem_invoiceId_fkey`;

-- DropForeignKey
ALTER TABLE `invoiceitem` DROP FOREIGN KEY `InvoiceItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `sale` DROP FOREIGN KEY `Sale_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `sale` DROP FOREIGN KEY `Sale_invoiceId_fkey`;

-- DropTable
DROP TABLE `invoice`;

-- DropTable
DROP TABLE `invoiceitem`;

-- DropTable
DROP TABLE `sale`;
