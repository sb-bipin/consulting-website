import "dotenv/config";
import { seedDatabase } from "../src/lib/seed";

seedDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
