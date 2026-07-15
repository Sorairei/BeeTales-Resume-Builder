import { UserRound } from "lucide-react";
import type { TranslationKey, Translator } from "../../data/translations";
import type { PersonalInformation } from "../../types/resume";
import { Accordion } from "./Accordion";

interface Props { personal: PersonalInformation; onChange: (field: keyof PersonalInformation, value: string) => void; t: Translator; }

const fields: Array<{ key: keyof PersonalInformation; label: TranslationKey; placeholder?: TranslationKey; literalPlaceholder?: string; type?: string; wide?: boolean }> = [
  { key: "fullName", label: "fullName", placeholder: "fullNamePlaceholder", wide: true },
  { key: "professionalTitle", label: "professionalTitle", placeholder: "professionalTitlePlaceholder", wide: true },
  { key: "email", label: "email", placeholder: "emailPlaceholder", type: "email" },
  { key: "phone", label: "phone", literalPlaceholder: "+52 55 0000 0000", type: "tel" },
  { key: "city", label: "city", placeholder: "cityPlaceholder" },
  { key: "region", label: "region", placeholder: "optional" },
  { key: "country", label: "country", placeholder: "countryPlaceholder" },
  { key: "address", label: "address", placeholder: "optional" },
  { key: "linkedin", label: "linkedin", literalPlaceholder: "linkedin.com/in/username", type: "url" },
  { key: "github", label: "github", literalPlaceholder: "github.com/username", type: "url" },
  { key: "website", label: "website", literalPlaceholder: "mywebsite.com", type: "url" },
  { key: "portfolio", label: "portfolio", literalPlaceholder: "portfolio.com", type: "url" },
];

export function PersonalForm({ personal, onChange, t }: Props) {
  return (
    <Accordion title={t("personalInfo")} description={t("personalInfoHelp")} icon={<UserRound size={18} />} defaultOpen badge={t("essential")}>
      <div className="form-grid">
        {fields.map((field) => (
          <label className={`field ${field.wide ? "field-wide" : ""}`} key={field.key}>
            <span>{t(field.label)}</span>
            <input type={field.type ?? "text"} value={personal[field.key]} onChange={(event) => onChange(field.key, event.target.value)} placeholder={field.placeholder ? t(field.placeholder) : field.literalPlaceholder} maxLength={field.key === "professionalTitle" ? 100 : 180} />
          </label>
        ))}
      </div>
    </Accordion>
  );
}
