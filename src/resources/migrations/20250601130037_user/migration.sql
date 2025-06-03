-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "role" SMALLINT NOT NULL,
    "name" VARCHAR NOT NULL,
    "profile_image_url" VARCHAR,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3),
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCredential" (
    "id" INTEGER NOT NULL,
    "login_id" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "pepper" VARCHAR NOT NULL,

    CONSTRAINT "UserCredential_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserCredential" ADD CONSTRAINT "UserCredential_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
