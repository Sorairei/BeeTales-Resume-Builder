import type { Dispatch, SetStateAction } from "react";
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, ListTree } from "lucide-react";
import type { TranslationKey, Translator } from "../../data/translations";
import type { ResumeData } from "../../types/resume";
import { Accordion } from "./Accordion";

interface Props { resume: ResumeData; setResume: Dispatch<SetStateAction<ResumeData>>; t: Translator; }

const fixedLabels: Record<string, TranslationKey> = {
  summary: "summary", experience: "experience", education: "education", skills: "skills", languages: "languages",
  certifications: "certifications", projects: "projects", courses: "courses", references: "references",
};

export function SectionManager({ resume, setResume, t }: Props) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const validIds = new Set([...Object.keys(fixedLabels), ...resume.customSections.map((section) => section.id)]);
  const ids = resume.sectionOrder.filter((id) => validIds.has(id));
  validIds.forEach((id) => { if (!ids.includes(id)) ids.push(id); });

  const labelFor = (id: string) => fixedLabels[id] ? t(fixedLabels[id]) : resume.customSections.find((section) => section.id === id)?.title || t("newCustomSection");
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    setResume((current) => ({ ...current, sectionOrder: arrayMove(ids, oldIndex, newIndex) }));
  };
  const toggleHidden = (id: string) => setResume((current) => ({
    ...current,
    hiddenSections: current.hiddenSections.includes(id) ? current.hiddenSections.filter((entry) => entry !== id) : [...current.hiddenSections, id],
  }));

  return (
    <Accordion title={t("sectionOrganization")} description={t("sectionOrganizationHelp")} icon={<ListTree size={18} />} badge={t("dragToReorder")}>
      <p className="section-manager-help">{t("sectionManagerTip")}</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="section-sort-list">{ids.map((id) => <SortableSection key={id} id={id} label={labelFor(id)} hidden={resume.hiddenSections.includes(id)} onToggle={() => toggleHidden(id)} t={t} />)}</div>
        </SortableContext>
      </DndContext>
    </Accordion>
  );
}

function SortableSection({ id, label, hidden, onToggle, t }: { id: string; label: string; hidden: boolean; onToggle: () => void; t: Translator }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div ref={setNodeRef} className={`section-sort-item ${isDragging ? "is-dragging" : ""} ${hidden ? "is-hidden-section" : ""}`} style={{ transform: CSS.Transform.toString(transform), transition }}>
      <button type="button" className="drag-handle" title={t("dragSection")} {...attributes} {...listeners}><GripVertical size={17} /></button>
      <span>{label}</span>
      <button type="button" className="visibility-button" title={hidden ? t("showSection") : t("hideSection")} onClick={onToggle}>{hidden ? <EyeOff size={16} /> : <Eye size={16} />}<span>{hidden ? t("hidden") : t("visible")}</span></button>
    </div>
  );
}
