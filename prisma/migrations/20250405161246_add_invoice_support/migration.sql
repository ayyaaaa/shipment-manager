/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `code` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `sale` MODIFY `paidAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `Invoice_code_key` ON `Invoice`(`code`);
