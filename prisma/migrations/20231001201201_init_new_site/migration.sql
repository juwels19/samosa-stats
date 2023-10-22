-- CreateTable
CREATE TABLE "Pick" (
    "id" SERIAL NOT NULL,
    "createdAt" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userFullname" TEXT NOT NULL,
    "displayName" TEXT,
    "answersJSON" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "Pick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" SERIAL NOT NULL,
    "createdAt" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "district" TEXT NOT NULL,
    "districtKey" TEXT NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "createdAt" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "eventCode" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "isSubmissionClosed" BOOLEAN NOT NULL DEFAULT false,
    "isSetup" BOOLEAN DEFAULT false,
    "numberOfTeamPicks" INTEGER NOT NULL DEFAULT 8,
    "numberOfCategoryPicks" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pick_userId_eventId_key" ON "Pick"("userId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_eventCode_key" ON "Event"("eventCode");

-- AddForeignKey
ALTER TABLE "Pick" ADD CONSTRAINT "Pick_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
