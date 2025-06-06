-- AlterTable
ALTER TABLE "user" ADD COLUMN     "email" VARCHAR,
ADD COLUMN     "employee_code" VARCHAR,
ADD COLUMN     "phone_number" VARCHAR;

-- AlterTable
ALTER TABLE "user_credential" ADD COLUMN     "deleted_at" TIMESTAMPTZ(3);
