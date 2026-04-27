ALTER TABLE "Review" ALTER COLUMN "clientProfileId" DROP NOT NULL;

ALTER TABLE "Review"
  ADD COLUMN "clienteNome" TEXT,
  ADD COLUMN "clienteEmail" TEXT,
  ADD COLUMN "mostrarNome" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Review" DROP CONSTRAINT IF EXISTS "Review_clientProfileId_fkey";

ALTER TABLE "Review"
  ADD CONSTRAINT "Review_clientProfileId_fkey"
  FOREIGN KEY ("clientProfileId") REFERENCES "ClientProfile"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
