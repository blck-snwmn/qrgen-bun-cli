import meow from "meow";

const FORMATS = ["png", "svg", "terminal"] as const;
type Format = (typeof FORMATS)[number];

const ERROR_LEVELS = ["L", "M", "Q", "H"] as const;
type ErrorLevel = (typeof ERROR_LEVELS)[number];

function isFormat(value: string): value is Format {
  return (FORMATS as readonly string[]).includes(value);
}

function isErrorLevel(value: string): value is ErrorLevel {
  return (ERROR_LEVELS as readonly string[]).includes(value);
}

export interface CliOptions {
  text: string;
  format: Format;
  output?: string;
  size: number;
  errorLevel: ErrorLevel;
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

  const formatRaw = cli.flags.format;
  if (!isFormat(formatRaw)) {
    return { error: `Invalid format: ${formatRaw}` };
  }
  const format = formatRaw;
  const output = cli.flags.output;
  const size = cli.flags.size;
  const errorLevelRaw = cli.flags.errorLevel;
  if (!isErrorLevel(errorLevelRaw)) {
    return { error: `Invalid error level: ${errorLevelRaw}` };
  }
  const errorLevel = errorLevelRaw;

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
