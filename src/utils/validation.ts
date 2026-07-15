export type PersonalFieldIssue = "invalidEmail" | "invalidPhone" | "invalidUrl";

export function isValidEmail(value: string): boolean {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidPhone(value: string): boolean {
  return !value || (/^[+\d][\d\s().-]{5,30}$/.test(value) && value.replace(/\D/g, "").length >= 6);
}

export function isValidWebAddress(value: string): boolean {
  if (!value) return true;
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return ["http:", "https:"].includes(url.protocol) && url.hostname.includes(".") && !/\s/.test(value);
  } catch { return false; }
}

export function validatePersonalField(field: string, value: string): PersonalFieldIssue | undefined {
  if (field === "email" && !isValidEmail(value)) return "invalidEmail";
  if (field === "phone" && !isValidPhone(value)) return "invalidPhone";
  if (["linkedin", "github", "website", "portfolio"].includes(field) && !isValidWebAddress(value)) return "invalidUrl";
  return undefined;
}
