import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

// ─── CONFIG ──────────────────────────────────────────────────────────────────
// Supabase project URL and service-role key.
// The service-role key is needed to list files in a private/public bucket.
// Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your .env file if missing.
const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const BUCKET = "animals";
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error(
      "❌  SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env",
    );
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // 1. List all files in the 'animals' bucket
  const { data: files, error } = await supabase.storage.from(BUCKET).list();

  if (error) {
    console.error("❌  Failed to list bucket files:", error.message);
    process.exit(1);
  }

  if (!files || files.length === 0) {
    console.warn("⚠️  No files found in bucket:", BUCKET);
    return;
  }

  console.log(`📦  Found ${files.length} file(s) in bucket "${BUCKET}":`);
  files.forEach((f) => console.log(`   • ${f.name}`));

  // 2. Build a lookup map: lowercase-name-without-extension → full public URL
  const urlMap = new Map<string, string>();

  for (const file of files) {
    // Remove extension to get the bare animal name (e.g. "dog.jpg" → "dog")
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "").toLowerCase();

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(file.name);

    urlMap.set(nameWithoutExt, publicUrlData.publicUrl);
  }

  // 3. Fetch all animals from the database
  const animals = await prisma.animal.findMany();
  console.log(`\n🐾  Found ${animals.length} animal(s) in the database.`);

  let updated = 0;
  let skipped = 0;

  // 4. Update each animal's imageURL if a matching file was found
  for (const animal of animals) {
    const key = animal.englishName.toLowerCase();
    const imageURL = urlMap.get(key);

    if (!imageURL) {
      console.warn(
        `⚠️  No image found in bucket for: "${animal.englishName}" (looked for key: "${key}")`,
      );
      skipped++;
      continue;
    }

    await prisma.animal.update({
      where: { id: animal.id },
      data: { imageURL },
    });

    console.log(`✅  Updated "${animal.englishName}" → ${imageURL}`);
    updated++;
  }

  console.log(
    `\n🎉  Done! Updated: ${updated}, Skipped (no match): ${skipped}`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
