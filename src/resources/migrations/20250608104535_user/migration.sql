-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "role" SMALLINT NOT NULL,
    "name" VARCHAR NOT NULL,
    "profile_image_url" VARCHAR,
    "email" VARCHAR,
    "phone_number" VARCHAR,
    "employee_code" VARCHAR,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3),
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_credential" (
    "id" INTEGER NOT NULL,
    "login_id" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "pepper" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3),
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "user_credential_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_credential" ADD CONSTRAINT "user_credential_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
