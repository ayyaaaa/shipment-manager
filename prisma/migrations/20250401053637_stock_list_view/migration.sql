/*
  Warnings:

  - You are about to drop the column `sellPrice` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `capital` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `customer` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `expensetype` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `product` DROP COLUMN `sellPrice`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `sellingPrice` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `shipment` MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'in transit';
