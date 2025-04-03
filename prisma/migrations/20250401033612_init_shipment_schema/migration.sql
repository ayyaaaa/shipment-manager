/*
  Warnings:

  - Added the required column `capitalId` to the `ShipmentExpense` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `ExpenseType_name_key` ON `expensetype`;

-- AlterTable
ALTER TABLE `shipmentexpense` ADD COLUMN `capitalId` INTEGER NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `shipmentitem` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `ShipmentExpense` ADD CONSTRAINT `ShipmentExpense_capitalId_fkey` FOREIGN KEY (`capitalId`) REFERENCES `Capital`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
