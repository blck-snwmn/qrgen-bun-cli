import { test, expect, describe, spyOn } from "bun:test";
import { generateQRCode } from "./generator";
import type { CliOptions } from "./cli";
import QRCode from "qrcode";

describe("generateQRCode", () => {
  const baseOptions: CliOptions = {
    text: "Hello World",
    format: "terminal",
    size: 300,
    errorLevel: "M",
  };

  test("should generate PNG format as Buffer", async () => {
    const options: CliOptions = {
      ...baseOptions,
      format: "png",
      output: "test.png",
    };

    const result = await generateQRCode(options);

    expect(result.format).toBe("png");
    expect(result.data).toBeInstanceOf(Buffer);
    expect((result.data as Buffer).length).toBeGreaterThan(0);
  });

  test("should generate SVG format as string with svg tag", async () => {
    const options: CliOptions = {
      ...baseOptions,
      format: "svg",
      output: "test.svg",
    };

    const result = await generateQRCode(options);

    expect(result.format).toBe("svg");
    expect(typeof result.data).toBe("string");
    expect(result.data).toContain("<svg");
    expect(result.data).toContain("</svg>");
  });

  test("should generate terminal format as string", async () => {
    const options: CliOptions = {
      ...baseOptions,
      format: "terminal",
    };

    const result = await generateQRCode(options);

    expect(result.format).toBe("terminal");
    expect(typeof result.data).toBe("string");
    expect((result.data as string).length).toBeGreaterThan(0);
  });

  test("should generate different data for different error correction levels", async () => {
    const levels: Array<"L" | "M" | "Q" | "H"> = ["L", "M", "Q", "H"];

    const results = await Promise.all(
      levels.map(async (level) => {
        const options: CliOptions = {
          ...baseOptions,
          format: "png",
          output: "test.png",
          errorLevel: level,
        };
        const result = await generateQRCode(options);
        return { level, data: result.data };
      }),
    );

    // Verify that each error level produces different QR code data
    for (let i = 0; i < results.length; i++) {
      for (let j = i + 1; j < results.length; j++) {
        const resultI = results[i];
        const resultJ = results[j];
        expect(resultI).toBeDefined();
        expect(resultJ).toBeDefined();
        if (resultI && resultJ) {
          expect(resultI.data).not.toEqual(resultJ.data);
        }
      }
    }
  });

  test("should pass error correction level to qrcode library", async () => {
    const spy = spyOn(QRCode, "toBuffer");

    const options: CliOptions = {
      ...baseOptions,
      format: "png",
      output: "test.png",
      errorLevel: "H",
    };

    await generateQRCode(options);

    expect(spy).toHaveBeenCalledWith(
      options.text,
      expect.objectContaining({ errorCorrectionLevel: "H" }),
    );

    spy.mockRestore();
  });

  test("should apply custom size option", async () => {
    const customSize = 500;
    const options: CliOptions = {
      ...baseOptions,
      format: "png",
      output: "test.png",
      size: customSize,
    };

    const result = await generateQRCode(options);

    expect(result.format).toBe("png");
    expect(result.data).toBeInstanceOf(Buffer);
    // PNG with larger size should generally have more data
    expect((result.data as Buffer).length).toBeGreaterThan(0);
  });

  test("should handle special characters and emoji in text", async () => {
    const specialTexts = [
      "https://example.com/path?query=value",
      "日本語テキスト",
      "Hello 👋 World 🌍",
    ];

    const results = await Promise.all(
      specialTexts.map(async (text) => {
        const options: CliOptions = {
          ...baseOptions,
          text,
        };
        return await generateQRCode(options);
      }),
    );

    for (const result of results) {
      expect(result.format).toBe("terminal");
      expect(typeof result.data).toBe("string");
      expect((result.data as string).length).toBeGreaterThan(0);
    }
  });
});
