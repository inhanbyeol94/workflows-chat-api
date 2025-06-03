/*
  Warnings:

  - You are about to drop the `UserCredential` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserCredential" DROP CONSTRAINT "UserCredential_id_fkey";

-- DropTable
DROP TABLE "UserCredential";

-- CreateTable
CREATE TABLE "user_credential" (
    "id" INTEGER NOT NULL,
    "login_id" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "pepper" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3),

    CONSTRAINT "user_credential_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_credential" ADD CONSTRAINT "user_credential_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
