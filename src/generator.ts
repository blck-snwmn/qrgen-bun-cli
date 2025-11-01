import QRCode from "qrcode";
import type { CliOptions } from "./cli";

/**
 * Generate QR code in the specified format.
 * Format determines the generation method: png → toBuffer, others → toString
 */
export async function generateQRCode(options: CliOptions): Promise<string | Buffer> {
  const qrOptions = {
    errorCorrectionLevel: options.errorLevel,
    width: options.size,
  };

  try {
    return options.format === "png"
      ? QRCode.toBuffer(options.text, { ...qrOptions, type: "png" })
      : QRCode.toString(options.text, { ...qrOptions, type: options.format });
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error}`, { cause: error });
  }
}
