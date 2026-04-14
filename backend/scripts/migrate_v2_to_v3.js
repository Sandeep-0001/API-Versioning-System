import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { translateV2ToV3 } from "../src/utils/translationLayer.js";
import UserV2 from "../src/v2/models/User.js";
import UserV3 from "../src/v3/models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const URL = process.env.MONGO_URI || "mongodb://localhost:27017/local";

async function migrateData() {
  try {
    await mongoose.connect(URL);
    console.log("Connected to MongoDB for Migration");

    const v2Users = await UserV2.find();
    console.log(`Found ${v2Users.length} users in V2 collection.`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const v2User of v2Users) {
      const existingV3User = await UserV3.findOne({ email: v2User.email });
      if (existingV3User) {
        console.log(`Skipping ${v2User.email} - already exists in V3.`);
        skippedCount++;
        continue;
      }

      const v3Data = translateV2ToV3({
        firstName: v2User.firstName,
        lastName: v2User.lastName,
        email: v2User.email,
      });

      const newV3User = new UserV3({ ...v3Data, sourceVersion: "v2" });
      await newV3User.save();
      console.log(`Migrated ${v2User.email} to V3.`);
      migratedCount++;
    }

    console.log("\nMigration Complete.");
    console.log(`Total V2 Users: ${v2Users.length}`);
    console.log(`Migrated: ${migratedCount}`);
    console.log(`Skipped: ${skippedCount}`);

    process.exit(0);
  } catch (error) {
    console.error("Migration Error:", error);
    process.exit(1);
  }
}

migrateData();
