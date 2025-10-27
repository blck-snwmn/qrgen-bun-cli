import { parseArgs } from "./src/cli";
import { generateQRCode } from "./src/generator";
import { writeOutput } from "./src/output";

async function main() {
  const result = parseArgs(process.argv);

  if ("error" in result) {
    console.error(result.error);
    process.exit(1);
  }

  try {
    const qrData = await generateQRCode(result);
    await writeOutput(qrData, result.output);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
}

main();