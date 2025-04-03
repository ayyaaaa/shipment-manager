/*
  Warnings:

  - You are about to drop the column `createdAt` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `sellingPrice` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `capitalId` on the `shipmentexpense` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `shipmentexpense` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `shipmentitem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `shipmentexpense` DROP FOREIGN KEY `ShipmentExpense_capitalId_fkey`;

-- DropIndex
DROP INDEX `ShipmentExpense_capitalId_fkey` ON `shipmentexpense`;

-- AlterTable
ALTER TABLE `capital` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `customer` DROP COLUMN `createdAt`,
    ADD COLUMN `gst` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `createdAt`,
    DROP COLUMN `sellingPrice`,
    ADD COLUMN `sellPrice` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `shipmentexpense` DROP COLUMN `capitalId`,
    DROP COLUMN `createdAt`;

-- AlterTable
ALTER TABLE `shipmentitem` DROP COLUMN `createdAt`;
