import { describe, it, expect } from "vitest";
import { formatDateBogota, formatDateBogotaShort } from "../useFormatters";

describe("formatDateBogota (formato largo)", () => {
  it("retorna un string no vacío", () => {
    const result = formatDateBogota("2026-04-23");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("incluye el año correcto", () => {
    expect(formatDateBogota("2026-04-23")).toContain("2026");
    expect(formatDateBogota("2025-12-31")).toContain("2025");
  });

  it("interpreta la fecha en zona horaria Bogotá (UTC-5)", () => {
    // 2026-01-01T00:00:00-05:00 = 2026-01-01T05:00:00Z
    // NO debe retroceder a 2025-12-31
    const result = formatDateBogota("2026-01-01");
    expect(result).toContain("2026");
    expect(result).not.toContain("2025");
  });

  it("no retrocede un día al usar UTC medianoche para fecha de inicio de año", () => {
    // Sin el sufijo -05:00 la fecha sería 2025-12-31T19:00:00 en Bogotá
    const result = formatDateBogota("2026-01-01");
    expect(result).not.toMatch(/31/);
  });
});

describe("formatDateBogotaShort (formato corto)", () => {
  it("retorna un string no vacío", () => {
    const result = formatDateBogotaShort("2026-04-23");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("incluye el día correcto (23) para 2026-04-23", () => {
    expect(formatDateBogotaShort("2026-04-23")).toContain("23");
  });

  it("interpreta la fecha en zona horaria Bogotá (UTC-5)", () => {
    // Igual que el largo, no debe retroceder un día
    const result = formatDateBogotaShort("2026-01-01");
    expect(result).toContain("01");
  });

  it("produce un formato más corto que el largo", () => {
    const short = formatDateBogotaShort("2026-04-23");
    const long = formatDateBogota("2026-04-23");
    expect(short.length).toBeLessThan(long.length);
  });
});
