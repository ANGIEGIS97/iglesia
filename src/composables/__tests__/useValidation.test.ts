import { describe, it, expect } from "vitest";
import { isValidUrl, isUrl } from "../useValidation";

describe("isValidUrl (validador completo)", () => {
  it("acepta URL con https", () => {
    expect(isValidUrl("https://google.com")).toBe(true);
  });

  it("acepta URL con http", () => {
    expect(isValidUrl("http://example.com")).toBe(true);
  });

  it("acepta URL con www", () => {
    expect(isValidUrl("www.google.com")).toBe(true);
  });

  it("acepta correos electrónicos", () => {
    expect(isValidUrl("usuario@ejemplo.com")).toBe(true);
    expect(isValidUrl("contacto@iglesia.org")).toBe(true);
  });

  it("acepta URL con subdominio", () => {
    expect(isValidUrl("https://maps.google.com/place/123")).toBe(true);
  });

  it("rechaza string vacío", () => {
    expect(isValidUrl("")).toBe(false);
  });

  it("rechaza direcciones con 'Calle'", () => {
    expect(isValidUrl("Calle 23 # 45-30")).toBe(false);
  });

  it("rechaza direcciones con 'Carrera'", () => {
    expect(isValidUrl("Carrera 15 # 80-20")).toBe(false);
  });

  it("rechaza direcciones con 'Avenida'", () => {
    expect(isValidUrl("Avenida El Dorado 68")).toBe(false);
  });

  it("rechaza direcciones abreviadas con 'Cra.'", () => {
    expect(isValidUrl("Cra. 7 # 32-16")).toBe(false);
  });

  it("rechaza patrón numérico de dirección (23 # 45-30)", () => {
    expect(isValidUrl("23 # 45-30")).toBe(false);
  });

  it("rechaza texto plano", () => {
    expect(isValidUrl("Salon principal de la iglesia")).toBe(false);
  });

  it("rechaza solo un dominio sin protocolo", () => {
    expect(isValidUrl("google")).toBe(false);
  });
});

describe("isUrl (validador simple con URL constructor)", () => {
  it("acepta URL con https", () => {
    expect(isUrl("https://google.com")).toBe(true);
  });

  it("acepta URL con http", () => {
    expect(isUrl("http://example.com")).toBe(true);
  });

  it("acepta URL con www (agrega http:// internamente)", () => {
    expect(isUrl("www.google.com")).toBe(true);
  });

  it("rechaza string vacío", () => {
    expect(isUrl("")).toBe(false);
  });

  it("rechaza texto sin formato de URL", () => {
    expect(isUrl("Salon comunal")).toBe(false);
    expect(isUrl("no es url")).toBe(false);
  });

  it("rechaza solo un número", () => {
    expect(isUrl("12345")).toBe(false);
  });
});
