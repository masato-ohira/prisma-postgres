/*
  Warnings:

  - You are about to drop the column `production_cost` on the `products` table. All the data in the column will be lost.
  - Added the required column `material_cost` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "production_cost",
ADD COLUMN     "material_cost" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;
