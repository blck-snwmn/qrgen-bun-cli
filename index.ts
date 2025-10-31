import { parseArgs } from "./src/cli";
import { generateQRCode } from "./src/generator";
import { write } from "./src/output";

async function main() {
  const result = parseArgs(process.argv);

  if ("error" in result) {
    console.error(result.error);
    process.exit(1);
  }

  try {
    const qrData = await generateQRCode(result);

    // Select output destination based on format (CLI determines output method)
    const destination = result.format === "terminal" ? Bun.stdout : result.output;

    // Validate destination (parseArgs already validates this, but check for type safety)
    if (!destination) {
      throw new Error("Output path is required for file formats");
    }

    // Write QR code to destination (unified write operation)
    await write(destination, qrData.data);

    // Status message to stderr for file output (doesn't interfere with stdout)
    if (result.format !== "terminal") {
      console.error(`QR code saved to: ${destination}`);
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
}

main();
