import QRCode from "qrcode";
import type { CliOptions } from "./cli";

export interface QRCodeData {
  format: "png" | "svg" | "terminal";
  data: string | Buffer;
}

export async function generateQRCode(options: CliOptions): Promise<QRCodeData> {
  const qrOptions = {
    errorCorrectionLevel: options.errorLevel,
    width: options.size,
  };

  try {
    switch (options.format) {
      case "png": {
        // Generate PNG as buffer
        const buffer = await QRCode.toBuffer(options.text, {
          ...qrOptions,
          type: "png",
        });
        return { format: "png", data: buffer };
      }
      case "svg": {
        // Generate SVG as string
        const svg = await QRCode.toString(options.text, {
          ...qrOptions,
          type: "svg",
        });
        return { format: "svg", data: svg };
      }
      case "terminal": {
        // Generate terminal output
        const terminal = await QRCode.toString(options.text, {
          ...qrOptions,
          type: "terminal",
        });
        return { format: "terminal", data: terminal };
      }
      default: {
        const _exhaustive: never = options.format;
        throw new Error(`Unsupported format: ${_exhaustive}`);
      }
    }
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error}`, { cause: error });
  }
}
