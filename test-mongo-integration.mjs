import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function test() {
  await client.connect();
  const db = client.db();
  console.log("Connected to MongoDB:", db.databaseName);

  // Trigger init check
  const { ensureDbInitialized, getAdminUsers, verifyAdminCredentials, getLicenses, getPricingSettings } = await import("./src/lib/db.ts");
  
  await ensureDbInitialized();
  console.log("ensureDbInitialized executed successfully.");

  const admins = await getAdminUsers();
  console.log("Admins count:", admins.length, "First admin username:", admins[0]?.username);

  const authTest = await verifyAdminCredentials("admin", "adminmimbar123");
  console.log("Admin credentials check result:", authTest ? "SUCCESS (" + authTest.name + ")" : "FAILED");

  const licenses = await getLicenses();
  console.log("Licenses count in MongoDB:", licenses.length, "Sample key:", licenses[0]?.key);

  const pricing = await getPricingSettings();
  console.log("Pricing from MongoDB:", "Monthly: " + pricing.monthlyPrice, "Yearly: " + pricing.yearlyPrice);

  await client.close();
}

test().catch(console.error);
