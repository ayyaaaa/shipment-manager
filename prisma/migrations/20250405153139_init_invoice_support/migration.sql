/*
  Warnings:

  - You are about to drop the column `amount` on the `capital` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `capital` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `expensetype` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Capital_name_key` ON `capital`;

-- DropIndex
DROP INDEX `Shipment_name_key` ON `shipment`;

-- AlterTable
ALTER TABLE `capital` DROP COLUMN `amount`,
    DROP COLUMN `updatedAt`,
    ALTER COLUMN `status` DROP DEFAULT;

-- AlterTable
ALTER TABLE `expensetype` DROP COLUMN `createdAt`;

-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `paidDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `createdAt`,
    ALTER COLUMN `sellingPrice` DROP DEFAULT;
