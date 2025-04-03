/*
  Warnings:

  - You are about to drop the column `sellPrice` on the `product` table. All the data in the column will be lost.
  - You are about to drop the `capital` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sellingPrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `stock` DROP FOREIGN KEY `Stock_capitalId_fkey`;

-- DropForeignKey
ALTER TABLE `stock` DROP FOREIGN KEY `Stock_productId_fkey`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `sellPrice`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `sellingPrice` DOUBLE NOT NULL;

-- DropTable
DROP TABLE `capital`;

-- DropTable
DROP TABLE `stock`;
