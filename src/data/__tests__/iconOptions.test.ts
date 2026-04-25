import { describe, it, expect } from "vitest";
import { iconOptions } from "../iconOptions";

describe("iconOptions", () => {
  it("tiene 11 entradas", () => {
    expect(iconOptions).toHaveLength(11);
  });

  it("la entrada Info tiene noTooltip: true", () => {
    const info = iconOptions.find((o) => o.value === "Info");
    expect(info).toBeDefined();
    expect(info?.noTooltip).toBe(true);
  });

  it("todas las entradas tienen los campos requeridos", () => {
    for (const opt of iconOptions) {
      expect(opt.value, `value faltante en "${opt.value}"`).toBeTruthy();
      expect(opt.label, `label faltante en "${opt.value}"`).toBeTruthy();
      expect(opt.colorClass, `colorClass faltante en "${opt.value}"`).toBeTruthy();
      expect(opt.icon, `icon faltante en "${opt.value}"`).toBeTruthy();
      expect(opt.colorName, `colorName faltante en "${opt.value}"`).toBeTruthy();
    }
  });

  it("no hay valores duplicados", () => {
    const values = iconOptions.map((o) => o.value);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });

  it("value y label coinciden en cada entrada", () => {
    for (const opt of iconOptions) {
      expect(opt.value).toBe(opt.label);
    }
  });

  it("los iconos terminan en .svg", () => {
    for (const opt of iconOptions) {
      expect(opt.icon, `${opt.value} icon should be .svg`).toMatch(/\.svg$/);
    }
  });

  it("las clases de color tienen el formato correcto de Tailwind", () => {
    for (const opt of iconOptions) {
      expect(opt.colorClass, `${opt.value} colorClass malformado`).toMatch(
        /^bg-[a-z]+-\d{3,}$/
      );
    }
  });
});
