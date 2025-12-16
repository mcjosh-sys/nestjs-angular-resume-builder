export function colorToHex(input: string): string {
  const value = input.trim().toLowerCase();

  // rgb() or rgba()
  const rgbMatch = value.match(/^rgba?\(([^)]+)\)$/);
  if (rgbMatch) {
    const [rVal, gVal, bVal, aVal = '1'] = rgbMatch[1].split(',');
    const r = parseFloat(rVal.trim());
    const g = parseFloat(gVal.trim());
    const b = parseFloat(bVal.trim());
    const a = parseFloat(aVal.trim());
    return rgbaToHex(r, g, b, a);
  }

  // hcl() or hcla()
  const hclMatch = value.match(/^hcla?\(([^)]+)\)$/);
  if (hclMatch) {
    const [hVal, cVal, lVal, aVal = '1'] = hclMatch[1].split(',');
    const h = parseFloat(hVal.trim());
    const c = parseFloat(cVal.trim());
    const l = parseFloat(lVal.trim());
    const a = parseFloat(aVal.trim());
    const { r: rOut, g: gOut, b: bOut } = hclToRgb(h, c, l);
    return rgbaToHex(rOut, gOut, bOut, a);
  }

  // Already hex
  if (/^#([0-9a-f]{3,8})$/.test(value)) {
    return value;
  }

  throw new Error(`Unsupported color format: ${input}`);
}

// ---------- Helpers ----------

function hclToRgb(h: number, c: number, l: number) {
  // Convert HCL to Lab
  const aLab = Math.cos((h * Math.PI) / 180) * c;
  const bLab = Math.sin((h * Math.PI) / 180) * c;

  // Lab to XYZ
  let yTmp = (l + 16) / 116;
  let xTmp = aLab / 500 + yTmp;
  let zTmp = yTmp - bLab / 200;

  const f = (t: number) => (Math.pow(t, 3) > 0.008856 ? Math.pow(t, 3) : (t - 16 / 116) / 7.787);

  let X = 95.047 * f(xTmp);
  let Y = 100.0 * f(yTmp);
  let Z = 108.883 * f(zTmp);

  // XYZ to RGB
  X /= 100;
  Y /= 100;
  Z /= 100;

  const rLin = X * 3.2406 + Y * -1.5372 + Z * -0.4986;
  const gLin = X * -0.9689 + Y * 1.8758 + Z * 0.0415;
  const bLin = X * 0.0557 + Y * -0.204 + Z * 1.057;

  const gamma = (v: number) => (v > 0.0031308 ? 1.055 * Math.pow(v, 1 / 2.4) - 0.055 : 12.92 * v);

  const r = Math.min(Math.max(0, gamma(rLin)), 1) * 255;
  const g = Math.min(Math.max(0, gamma(gLin)), 1) * 255;
  const b = Math.min(Math.max(0, gamma(bLin)), 1) * 255;

  return { r, g, b };
}

function rgbaToHex(r: number, g: number, b: number, a: number = 1) {
  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

  const toHex = (v: number) =>
    Math.round(clamp(v, 0, 255))
      .toString(16)
      .padStart(2, '0');

  const alpha = a < 1 ? toHex(Math.round(clamp(a, 0, 1) * 255)) : '';

  return `#${toHex(r)}${toHex(g)}${toHex(b)}${alpha}`;
}
