-- AlterTable
ALTER TABLE "channel" ADD COLUMN     "creator_id" INTEGER,
ADD COLUMN     "description" TEXT;

-- AddForeignKey
ALTER TABLE "channel" ADD CONSTRAINT "channel_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
