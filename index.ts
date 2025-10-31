import { parseArgs } from "./src/cli";
import { generateQRCode } from "./src/generator";
import { write } from "./src/output";

async function main() {
  const options = parseArgs(process.argv);

  if ("error" in options) {
    console.error(options.error);
    process.exit(1);
  }

  try {
    // Select output destination based on format (CLI determines output method)
    const destination = options.format === "terminal" ? Bun.stdout : options.output;

    // Validate destination (parseArgs already validates this, but check for type safety)
    if (!destination) {
      throw new Error("Output path is required for file formats");
    }

    // Generate QR code after validating destination (avoid wasteful generation)
    const qrData = await generateQRCode(options);

    // Write QR code to destination (unified write operation)
    await write(destination, qrData.data);

    // Status message to stderr for file output (doesn't interfere with stdout)
    if (options.format !== "terminal") {
      console.error(`QR code saved to: ${destination}`);
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
}

main();
