import { useState, type PropsWithChildren, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionProps extends PropsWithChildren {
  title: string;
  description: string;
  icon: ReactNode;
  defaultOpen?: boolean;
  badge?: string;
  defer?: boolean;
}

export function Accordion({ title, description, icon, defaultOpen = false, badge, defer = false, children }: AccordionProps) {
  const [hasOpened, setHasOpened] = useState(defaultOpen || !defer);
  return (
    <details className="editor-section" open={defaultOpen} onToggle={(event) => { if (event.currentTarget.open) setHasOpened(true); }}>
      <summary>
        <span className="section-icon">{icon}</span>
        <span className="section-title"><strong>{title}</strong><small>{description}</small></span>
        {badge && <span className="section-badge">{badge}</span>}
        <ChevronDown className="chevron" size={18} aria-hidden="true" />
      </summary>
      <div className="section-body">{hasOpened ? children : null}</div>
    </details>
  );
}
