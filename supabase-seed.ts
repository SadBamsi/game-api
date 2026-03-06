import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import { parse } from "csv-parse/sync";

const prisma = new PrismaClient();

async function seedData(modelName: string, fileName: string) {
  console.log(`Reading ${fileName}...`);
  const fileContent = fs.readFileSync(fileName, "utf-8");

  // Parse CSV
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  }) as any[];

  console.log(
    `Parsed ${records.length} records. Uploading using Prisma for ${modelName}...`,
  );

  let result;
  switch (modelName) {
    case "color":
      result = await prisma.color.createMany({
        data: records,
        skipDuplicates: true,
      });
      break;
    case "fruit":
      result = await prisma.fruit.createMany({
        data: records,
        skipDuplicates: true,
      });
      break;
    case "animal":
      result = await prisma.animal.createMany({
        data: records,
        skipDuplicates: true,
      });
      break;
    case "shape":
      result = await prisma.shape.createMany({
        data: records,
        skipDuplicates: true,
      });
      break;
    default:
      console.log(`Model ${modelName} not supported.`);
      return;
  }

  console.log(
    `Successfully inserted ${result.count} records for ${modelName}!`,
  );
}
