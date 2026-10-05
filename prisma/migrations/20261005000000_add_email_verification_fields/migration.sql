-- AlterTable
ALTER TABLE "users" ADD COLUMN "emailVerified" TIMESTAMP(3),
ADD COLUMN "verificationToken" TEXT,
ADD COLUMN "verificationTokenExpires" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "users_verificationToken_key" ON "users"("verificationToken");
