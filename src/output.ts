import type { QRCodeData } from "./generator";

export async function writeOutput(qrData: QRCodeData, outputPath?: string): Promise<void> {
  if (qrData.format === "terminal") {
    // Terminal output - print to console
    console.info(qrData.data);
    return;
  }

  // File output for PNG/SVG
  if (!outputPath) {
    throw new Error("Output path is required for file output");
  }

  try {
    // Write file (PNG buffer or SVG string)
    await Bun.write(outputPath, qrData.data);
    console.info(`QR code saved to: ${outputPath}`);
  } catch (error) {
    throw new Error(`Failed to write output file: ${error}`, { cause: error });
  }
}
