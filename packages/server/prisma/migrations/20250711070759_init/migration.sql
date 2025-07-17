/*
  Warnings:

  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deaths" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "kills" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "name" TEXT; -- 一旦NULL許可で追加

-- 既存レコードにダミー値をセット（例: 'unknown'）
UPDATE "User" SET "name" = 'unknown' WHERE "name" IS NULL;

-- NOT NULL制約を追加
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;
