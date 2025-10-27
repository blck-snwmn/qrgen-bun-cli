import { test, expect } from "bun:test";
import { parseArgs } from "./cli";

test("parseArgs - should parse text only (default terminal)", () => {
  const result = parseArgs(["node", "script.js", "Hello"]);
  expect("error" in result).toBe(false);
  if (!("error" in result)) {
    expect(result.text).toBe("Hello");
    expect(result.format).toBe("terminal");
  }
});

test("parseArgs - should parse png format with output", () => {
  const result = parseArgs([
    "node",
    "script.js",
    "Test",
    "-f",
    "png",
    "-o",
    "output.png",
  ]);
  expect("error" in result).toBe(false);
  if (!("error" in result)) {
    expect(result.text).toBe("Test");
    expect(result.format).toBe("png");
    expect(result.output).toBe("output.png");
  }
});

test("parseArgs - should parse svg format with output", () => {
  const result = parseArgs([
    "node",
    "script.js",
    "SVG Test",
    "--format",
    "svg",
    "--output",
    "test.svg",
  ]);
  expect("error" in result).toBe(false);
  if (!("error" in result)) {
    expect(result.text).toBe("SVG Test");
    expect(result.format).toBe("svg");
    expect(result.output).toBe("test.svg");
  }
});

test("parseArgs - should parse size option", () => {
  const result = parseArgs([
    "node",
    "script.js",
    "Test",
    "-f",
    "terminal",
    "-s",
    "500",
  ]);
  expect("error" in result).toBe(false);
  if (!("error" in result)) {
    expect(result.size).toBe(500);
  }
});

test("parseArgs - should parse error level", () => {
  const result = parseArgs([
    "node",
    "script.js",
    "Test",
    "-f",
    "terminal",
    "-e",
    "H",
  ]);
  expect("error" in result).toBe(false);
  if (!("error" in result)) {
    expect(result.errorLevel).toBe("H");
  }
});

test("parseArgs - should error when no arguments", () => {
  const result = parseArgs(["node", "script.js"]);
  expect("error" in result).toBe(true);
});

test("parseArgs - should error when png/svg without output path", () => {
  const result = parseArgs(["node", "script.js", "Test", "-f", "png"]);
  expect("error" in result).toBe(true);
  if ("error" in result) {
    expect(result.error).toContain("Output path");
  }
});

test("parseArgs - should error on invalid format", () => {
  const result = parseArgs(["node", "script.js", "Test", "-f", "invalid"]);
  expect("error" in result).toBe(true);
  if ("error" in result) {
    expect(result.error).toContain("Unknown value for flag");
    expect(result.error).toContain("--format");
  }
});

test("parseArgs - should error on invalid error level", () => {
  const result = parseArgs(["node", "script.js", "Test", "-e", "X"]);
  expect("error" in result).toBe(true);
  if ("error" in result) {
    expect(result.error).toContain("Unknown value for flag");
    expect(result.error).toContain("--error-level");
  }
});
