/**
 * Validates URLs, emails, and rejects physical addresses (e.g. "Calle 23 # 45-30").
 * Used in FechaToEventoConverter to decide if a "lugar" field is linkable.
 */
export function isValidUrl(string: string): boolean {
  try {
    if (!string) return false;

    const urlPattern =
      /^(https?:\/\/|www\.)[a-z\d]+(\.[a-z\d]+)*\.[a-z]{2,}(:\d{1,5})?(\/.*)?$/i;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const addressIndicators = [
      /calle|carrera|avenida|av\.|transversal|diagonal|autopista|cra\.|cl\.|tv\.|dg\.|auto\./i,
      /\d+\s*[a-z]?\s*#\s*\d+\s*-\s*\d+/i,
      /\d+\s*[a-z]?\s*-\s*\d+/i,
    ];

    for (const pattern of addressIndicators) {
      if (pattern.test(string)) return false;
    }

    return urlPattern.test(string) || emailPattern.test(string);
  } catch {
    return false;
  }
}

/**
 * Simple URL check using the URL constructor.
 * Accepts "www." prefixes by prepending "http://".
 * Used in AdminFechasList to determine if a "lugar" should be rendered as a link.
 */
export function isUrl(str: string): boolean {
  if (!str) return false;
  const normalized = str.startsWith("www.") ? "http://" + str : str;
  try {
    new URL(normalized);
    return true;
  } catch {
    return false;
  }
}

export function useValidation() {
  return { isValidUrl, isUrl };
}
