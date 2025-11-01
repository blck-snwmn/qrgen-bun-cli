import QRCode from "qrcode";
import type { CliOptions } from "./cli";

/**
 * Generate QR code in the specified format.
 * Format determines the generation method: png → toBuffer, others → toString
 */
export async function generateQRCode(
  options: CliOptions,
): Promise<string | Buffer> {
  const qrOptions = {
    errorCorrectionLevel: options.errorLevel,
    width: options.size,
  };

  try {
    // png → toBuffer, others → toString
    if (options.format === "png") {
      return await QRCode.toBuffer(options.text, {
        ...qrOptions,
        type: "png",
      });
    }

    return await QRCode.toString(options.text, {
      ...qrOptions,
      type: options.format, // "svg" | "terminal"
    });
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error}`, { cause: error });
  }
}
