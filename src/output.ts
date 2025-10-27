import type { QRCodeData } from "./generator";

export async function writeOutput(
  qrData: QRCodeData,
  outputPath?: string
): Promise<void> {
  if (qrData.format === "terminal") {
    // Terminal output - print to console
    console.log(qrData.data);
    return;
  }

  // File output for PNG/SVG
  if (!outputPath) {
    throw new Error("Output path is required for file output");
  }

  try {
    if (qrData.format === "png") {
      // Write PNG buffer to file
      await Bun.write(outputPath, qrData.data as Buffer);
      console.log(`QR code saved to: ${outputPath}`);
    } else if (qrData.format === "svg") {
      // Write SVG string to file
      await Bun.write(outputPath, qrData.data as string);
      console.log(`QR code saved to: ${outputPath}`);
    }
  } catch (error) {
    throw new Error(`Failed to write output file: ${error}`);
  }
}
