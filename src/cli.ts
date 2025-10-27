import meow from "meow";

export interface CliOptions {
  text: string;
  format: "png" | "svg" | "terminal";
  output?: string;
  size?: number;
  errorLevel?: "L" | "M" | "Q" | "H";
}

export function parseArgs(args: string[]): CliOptions | { error: string } {
  let cli;
  try {
    cli = meow(
      `
    Usage
      $ qrgen <text> [options]

    Options
      -f, --format <format>         Output format: png, svg, terminal (default: terminal)
      -o, --output <path>           Output file path (required for png/svg)
      -s, --size <number>           QR code size in pixels (default: 300)
      -e, --error-level <L|M|Q|H>   Error correction level (default: M)

    Examples
      $ qrgen "Hello World"
      $ qrgen "https://example.com" -f png -o qr.png
      $ qrgen "QR Code" -f svg -o qr.svg -s 500 -e H
  `,
      {
        importMeta: import.meta,
        argv: args.slice(2),
        flags: {
          format: {
            type: "string",
            shortFlag: "f",
            default: "terminal",
            choices: ["png", "svg", "terminal"],
          },
          output: {
            type: "string",
            shortFlag: "o",
          },
          size: {
            type: "number",
            shortFlag: "s",
            default: 300,
          },
          errorLevel: {
            type: "string",
            shortFlag: "e",
            default: "M",
            choices: ["L", "M", "Q", "H"],
          },
        },
      },
    );
  } catch (error) {
    // meow throws an error for invalid choices
    return { error: String(error) };
  }

  // Validate input text
  if (cli.input.length === 0) {
    return { error: cli.help };
  }

  const text = cli.input[0];
  if (!text) {
    return { error: cli.help };
  }

  const format = cli.flags.format as "png" | "svg" | "terminal";
  const output = cli.flags.output;
  const size = cli.flags.size;
  const errorLevel = cli.flags.errorLevel as "L" | "M" | "Q" | "H";

  // Validate size
  if (size <= 0) {
    return { error: "Size must be a positive number" };
  }

  // Validate output path for png/svg
  if ((format === "png" || format === "svg") && !output) {
    return {
      error: `Output path (-o/--output) is required for ${format} format`,
    };
  }

  return {
    text,
    format,
    output,
    size,
    errorLevel,
  };
}
