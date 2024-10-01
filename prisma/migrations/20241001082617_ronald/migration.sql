-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "nameEnglish" TEXT NOT NULL,
    "nameJapanese" TEXT NOT NULL,
    "nameChinese" TEXT NOT NULL,
    "nameFrench" TEXT NOT NULL,
    "type" TEXT[],
    "baseId" INTEGER NOT NULL,
    "species" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "evolution" JSONB,
    "profile" JSONB,
    "imageId" INTEGER NOT NULL,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Base" (
    "id" SERIAL NOT NULL,
    "HP" INTEGER NOT NULL,
    "Attack" INTEGER NOT NULL,
    "Defense" INTEGER NOT NULL,
    "Sp_Attack" INTEGER NOT NULL,
    "Sp_Defense" INTEGER NOT NULL,
    "Speed" INTEGER NOT NULL,

    CONSTRAINT "Base_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "sprite" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "hires" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_baseId_key" ON "Pokemon"("baseId");

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_imageId_key" ON "Pokemon"("imageId");

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "Base"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
