import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, Copy, Plus, Trash2 } from "lucide-react";
import type { Translator } from "../../data/translations";
import { createId } from "../../utils/id";
import { moveItem } from "../../utils/arrays";
import { Accordion } from "./Accordion";

interface Identified { id: string; }

interface CollectionSectionProps<T extends Identified> {
  title: string;
  description: string;
  icon: ReactNode;
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  getItemTitle: (item: T, index: number) => string;
  getItemSubtitle?: (item: T) => string;
  renderFields: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
  addLabel: string;
  emptyLabel: string;
  emptyHelp: string;
  t: Translator;
  beforeList?: ReactNode;
  allowDuplicate?: boolean;
}

export function CollectionSection<T extends Identified>({
  title, description, icon, items, onChange, createItem, getItemTitle, getItemSubtitle, renderFields,
  addLabel, emptyLabel, emptyHelp, t, beforeList, allowDuplicate = true,
}: CollectionSectionProps<T>) {
  const update = (id: string, patch: Partial<T>) => onChange(items.map((item) => item.id === id ? { ...item, ...patch } : item));
  const remove = (id: string) => onChange(items.filter((item) => item.id !== id));
  const duplicate = (item: T, index: number) => {
    const copy = { ...structuredClone(item), id: createId("item") };
    const next = [...items];
    next.splice(index + 1, 0, copy);
    onChange(next);
  };

  return (
    <Accordion title={title} description={description} icon={icon} badge={String(items.length)}>
      {beforeList}
      <div className="item-stack">
        {items.map((item, index) => (
          <article className="experience-card collection-card" key={item.id}>
            <header>
              <span className="item-number">{index + 1}</span>
              <div><strong>{getItemTitle(item, index)}</strong>{getItemSubtitle && <small>{getItemSubtitle(item)}</small>}</div>
              <div className="item-actions">
                <button type="button" title={t("moveUp")} disabled={index === 0} onClick={() => onChange(moveItem(items, index, -1))}><ArrowUp size={15} /></button>
                <button type="button" title={t("moveDown")} disabled={index === items.length - 1} onClick={() => onChange(moveItem(items, index, 1))}><ArrowDown size={15} /></button>
                {allowDuplicate && <button type="button" title={t("duplicateItem")} onClick={() => duplicate(item, index)}><Copy size={15} /></button>}
                <button type="button" className="danger-icon" title={t("deleteItem")} onClick={() => remove(item.id)}><Trash2 size={15} /></button>
              </div>
            </header>
            {renderFields(item, (patch) => update(item.id, patch))}
          </article>
        ))}
        {items.length === 0 && <div className="empty-section"><strong>{emptyLabel}</strong><span>{emptyHelp}</span></div>}
      </div>
      <button className="add-button" type="button" onClick={() => onChange([...items, createItem()])}><Plus size={17} /> {addLabel}</button>
    </Accordion>
  );
}
