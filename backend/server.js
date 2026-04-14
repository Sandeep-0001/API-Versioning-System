import app from "./src/app.js";
import dotenv from "dotenv";
import connectDb from "./src/config/db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always load backend/.env even when command is run from workspace root.
dotenv.config({ path: path.join(__dirname, ".env") });

async function startServer() {
  const PORT = process.env.PORT || 3000;
  if (!PORT) {
    return console.error("PORT is not defined in enviornment variable");
  }
  try {
    connectDb().then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    });
  } catch (error) {
    console.error(`Error starting server: ${error}`);
  }
}

startServer();
