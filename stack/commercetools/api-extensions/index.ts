import { setupCustomerApiExtension } from "./customer";
import { setupOrderApiExtension } from "./order";

async function setupExtensions() {
  await setupCustomerApiExtension();
  await setupOrderApiExtension();
}

setupExtensions().catch((e) => {
  console.error(e);
  process.exit(1);
});
