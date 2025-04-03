/*
  Warnings:

  - You are about to drop the column `createdAt` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `sellingPrice` on the `product` table. All the data in the column will be lost.
  - Added the required column `sellPrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `createdAt`,
    DROP COLUMN `sellingPrice`,
    ADD COLUMN `sellPrice` DOUBLE NOT NULL;

-- CreateTable
CREATE TABLE `Stock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `capitalId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Stock` ADD CONSTRAINT `Stock_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stock` ADD CONSTRAINT `Stock_capitalId_fkey` FOREIGN KEY (`capitalId`) REFERENCES `Capital`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
