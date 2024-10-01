import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  await prisma.pokemon.deleteMany({});
  await prisma.image.deleteMany({});
  await prisma.base.deleteMany({});

  // Reset the sequences for auto-increment fields
  await prisma.$executeRaw`ALTER SEQUENCE "Base_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Image_id_seq" RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE "Pokemon_id_seq" RESTART WITH 1;`;
  const dataPath = path.join(__dirname, "../pokemon.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  for (const item of data) {
    const base = await prisma.base.create({
      data: {
        HP: item.base?.HP ?? null,
        Attack: item.base?.Attack ?? null,
        Defense: item.base?.Defense ?? null,
        SpAttack: item.base?.["Sp. Attack"] ?? null,
        SpDefense: item.base?.["Sp. Defense"] ?? null,
        Speed: item.base?.Speed ?? null,
      },
    });

    const image = await prisma.image.create({
      data: {
        sprite: item.image?.sprite ?? "",
        thumbnail: item.image?.thumbnail ?? "",
        hires: item.image?.hires ?? "",
      },
    });

    await prisma.pokemon.create({
      data: {
        pokemonID: item.id,
        nameEnglish: item.name.english,
        nameJapanese: item.name.japanese,
        nameChinese: item.name.chinese,
        nameFrench: item.name.french,
        type: item.type,
        baseId: base.id,
        species: item.species,
        description: item.description,
        evolution: item.evolution,
        profile: item.profile,
        imageId: image.id,
      },
    });
  }

  console.log("Data imported successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
