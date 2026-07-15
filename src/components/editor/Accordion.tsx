import type { PropsWithChildren, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionProps extends PropsWithChildren {
  title: string;
  description: string;
  icon: ReactNode;
  defaultOpen?: boolean;
  badge?: string;
}

export function Accordion({ title, description, icon, defaultOpen = false, badge, children }: AccordionProps) {
  return (
    <details className="editor-section" open={defaultOpen}>
      <summary>
        <span className="section-icon">{icon}</span>
        <span className="section-title"><strong>{title}</strong><small>{description}</small></span>
        {badge && <span className="section-badge">{badge}</span>}
        <ChevronDown className="chevron" size={18} aria-hidden="true" />
      </summary>
      <div className="section-body">{children}</div>
    </details>
  );
}
