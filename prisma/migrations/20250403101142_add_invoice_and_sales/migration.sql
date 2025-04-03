/*
  Warnings:

  - You are about to drop the column `paid` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `paidDate` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `invoiceitem` table. All the data in the column will be lost.
  - Added the required column `dueDate` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `paid`,
    DROP COLUMN `paidDate`,
    ADD COLUMN `dueDate` DATETIME(3) NOT NULL,
    ADD COLUMN `shippingCost` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'unpaid';

-- AlterTable
ALTER TABLE `invoiceitem` DROP COLUMN `unitPrice`,
    ADD COLUMN `price` DOUBLE NOT NULL;

-- CreateTable
CREATE TABLE `Sale` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoiceId` INTEGER NOT NULL,
    `customerId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `paidAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Sale_invoiceId_key`(`invoiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
