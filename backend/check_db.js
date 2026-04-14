import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const URL = process.env.MONGO_URI || "mongodb://localhost:27017/local";

async function checkCollections() {
  try {
    await mongoose.connect(URL);
    console.log("Connected to MongoDB");

    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log("Collections in DB:", collectionNames);

    if (
      collectionNames.includes("users_v1") &&
      collectionNames.includes("users_v2") &&
      collectionNames.includes("users_v3")
    ) {
      console.log("SUCCESS: users_v1, users_v2 and users_v3 collections exist.");
    } else {
      console.log("WARNING: One or more version collections are missing.");
    }
    
    // Optional: Check document structure
    const v1Users = await mongoose.connection.db.collection("users_v1").find().toArray();
    console.log("V1 Users Sample:", v1Users);

    const v2Users = await mongoose.connection.db.collection("users_v2").find().toArray();
    console.log("V2 Users Sample:", v2Users);

    const v3Users = await mongoose.connection.db.collection("users_v3").find().toArray();
    console.log("V3 Users Sample:", v3Users);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}

checkCollections();
