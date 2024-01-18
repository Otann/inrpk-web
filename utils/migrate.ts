import "dotenv/config";
import { devDb, migrate } from "app/lib/db";

const main = async () => {
  try {
    await migrate(devDb, { migrationsFolder: "drizzle" });
    console.log("Migration complete");
  } catch (error) {
    console.log(error);
  }
  process.exit(0);
};

main()

