-- CreateEnum
CREATE TYPE "BetStatus" AS ENUM ('pending', 'won', 'lost');

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "coefficient" DOUBLE PRECISION NOT NULL,
    "deadline" BIGINT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bets" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "potential_win" DOUBLE PRECISION NOT NULL,
    "status" "BetStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "bets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bets" ADD CONSTRAINT "bets_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
