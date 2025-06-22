-- CreateTable
CREATE TABLE "channel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_secret" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3),

    CONSTRAINT "channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_users" (
    "channel_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel_users_pkey" PRIMARY KEY ("channel_id","user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "channel_name_key" ON "channel"("name");

-- AddForeignKey
ALTER TABLE "channel_users" ADD CONSTRAINT "channel_users_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_users" ADD CONSTRAINT "channel_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
