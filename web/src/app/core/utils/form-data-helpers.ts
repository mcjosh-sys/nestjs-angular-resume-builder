export function toFormData<T extends Record<string, any>>(formValue: T): FormData {
  const formData = new FormData();

  for (const key of Object.keys(formValue)) {
    const value = formValue[key];

    if (value === null || value === undefined) continue;

    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
      continue;
    }

    if (value instanceof Date) {
      formData.append(key, value.toISOString());
      continue;
    }

    formData.append(key, JSON.stringify(value));
  }

  return formData;
}

export function parseIsoString<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => parseIsoString(item)) as unknown as T;
  }

  // Handle objects (but not Date)
  if (typeof data === 'object' && !(data instanceof Date)) {
    const result: Record<string, any> = {};
    for (const key in data) {
      result[key] = parseIsoString((data as Record<string, any>)[key]);
    }
    return result as T;
  }

  // Handle ISO date strings
  if (typeof data === 'string' && isIsoDateString(data)) {
    return new Date(data) as unknown as T;
  }

  // Primitives or non-ISO strings
  return data;
}

/**
 * Checks if a string is a valid ISO 8601 date or datetime string.
 * Supports formats like:
 * - YYYY-MM-DD
 * - YYYY-MM-DDTHH:mm:ssZ
 * - YYYY-MM-DDTHH:mm:ss.sssZ
 * - With timezone offsets as well.
 */
export function isIsoDateString(value: string): boolean {
  if (typeof value !== 'string') return false;

  // ISO 8601 regex that allows:
  // - Date only: YYYY-MM-DD
  // - Date + time (with optional milliseconds and timezone)
  const isoRegex = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?$/;

  if (!isoRegex.test(value)) return false;

  const date = new Date(value);
  return !isNaN(date.getTime());
}
