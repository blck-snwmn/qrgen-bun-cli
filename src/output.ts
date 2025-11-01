/**
 * Unified write interface for both files and stdout (Go io.Writer style).
 *
 * @param destination - File path or BunFile (e.g., Bun.stdout)
 * @param data - Data to write
 * @returns Number of bytes written
 */
export async function write(
  destination: typeof Bun.stdout | string,
  data: string | Buffer,
): Promise<number> {
  return Bun.write(destination, data);
}
