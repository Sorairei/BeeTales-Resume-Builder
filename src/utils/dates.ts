import { localeByLanguage } from "../data/translations";
import type { AppLanguage } from "../types/resume";

export function formatDate(value: string, language: AppLanguage): string {
  if (!value) return "";
  const [year, month] = value.split("-");
  if (!month) return year;
  return new Intl.DateTimeFormat(localeByLanguage[language], { month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(Number(year), Number(month) - 1, 1)))
    .replace(".", "");
}
