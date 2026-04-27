ALTER TABLE "WorkerProfile"
  ADD COLUMN "ultimaAtividade" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX "WorkerProfile_isAvailable_ultimaAtividade_idx"
  ON "WorkerProfile"("isAvailable", "ultimaAtividade");
