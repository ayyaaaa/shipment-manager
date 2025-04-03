/*
  Warnings:

  - You are about to drop the column `customerId` on the `shipment` table. All the data in the column will be lost.
  - You are about to drop the `expense` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Shipment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipmentDate` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `ShipmentItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `expense` DROP FOREIGN KEY `Expense_capitalId_fkey`;

-- DropForeignKey
ALTER TABLE `expense` DROP FOREIGN KEY `Expense_shipmentId_fkey`;

-- DropForeignKey
ALTER TABLE `shipment` DROP FOREIGN KEY `Shipment_customerId_fkey`;

-- DropIndex
DROP INDEX `Shipment_customerId_fkey` ON `shipment`;

-- AlterTable
ALTER TABLE `shipment` DROP COLUMN `customerId`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `shipmentDate` DATETIME(3) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `shipmentitem` ADD COLUMN `customerId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `expense`;

-- CreateTable
CREATE TABLE `ExpenseType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ExpenseType_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShipmentExpense` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shipmentId` INTEGER NOT NULL,
    `expenseTypeId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Shipment_name_key` ON `Shipment`(`name`);

-- AddForeignKey
ALTER TABLE `ShipmentItem` ADD CONSTRAINT `ShipmentItem_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShipmentExpense` ADD CONSTRAINT `ShipmentExpense_shipmentId_fkey` FOREIGN KEY (`shipmentId`) REFERENCES `Shipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShipmentExpense` ADD CONSTRAINT `ShipmentExpense_expenseTypeId_fkey` FOREIGN KEY (`expenseTypeId`) REFERENCES `ExpenseType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
