# qrgen-bun-cli

A QR code generator CLI built with [Bun](https://bun.com). Supports multiple output formats: PNG, SVG, and terminal display.

## Features

- **Multiple output formats**: PNG, SVG, and terminal (ASCII art)
- **Single binary**: Compile to standalone executable for easy distribution
- **Customizable**: Adjust QR code size and error correction level
- **Zero config**: Simple, lightweight CLI with minimal dependencies

## Installation

```bash
bun install
```

## Usage

### Development mode

```bash
# Terminal output (default)
bun run index.ts "Your text here"

# PNG output
bun run index.ts "https://example.com" -f png -o qr.png

# SVG output
bun run index.ts "Hello World" -f svg -o qr.svg

# Custom size and error level
bun run index.ts "Text" -f png -o qr.png -s 500 -e H
```

### Build standalone binary

```bash
# Build for macOS (ARM64)
bun run build:macos

# Build for Linux (x64)
bun run build:linux

# Build both
bun run build
```

### Use compiled binary

```bash
# Terminal output
./dist/qrgen-macos "Your text here"

# PNG output
./dist/qrgen-macos "https://example.com" -f png -o qr.png

# SVG output
./dist/qrgen-macos "Hello World" -f svg -o qr.svg
```

## CLI Options

```
qrgen <text> [options]

Options:
  -f, --format <format>         Output format: png, svg, terminal (default: terminal)
  -o, --output <path>           Output file path (required for png/svg)
  -s, --size <number>           QR code size in pixels (default: 300)
  -e, --error-level <L|M|Q|H>   Error correction level (default: M)
  -h, --help                    Show help
```

## Error Correction Levels

- **L**: Low (~7% correction)
- **M**: Medium (~15% correction) - default
- **Q**: Quartile (~25% correction)
- **H**: High (~30% correction)

## Testing

```bash
bun test
```

## Project Structure

```
qrgen-bun-cli/
├── src/
│   ├── cli.ts          # CLI argument parsing
│   ├── generator.ts    # QR code generation logic
│   ├── output.ts       # Output handling
│   └── cli.test.ts     # Tests
├── index.ts            # Entry point
├── package.json
└── README.md
```
