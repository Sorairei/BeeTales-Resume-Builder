import { useEffect, useState } from "react";
import { defaultResume } from "../data/defaultResume";
import { emptyResume } from "../data/emptyResume";
import { clearResume, loadResume, saveResume } from "../services/storageService";
import type { ExperienceItem, PersonalInformation, ResumeData, SaveStatus } from "../types/resume";
import { createId } from "../utils/id";

const clone = <T,>(value: T): T => structuredClone(value);

function blankExperience(): ExperienceItem {
  return { id: createId("experience"), company: "", position: "", location: "", workMode: "onsite", startDate: "", endDate: "", current: false, description: "", achievements: [""] };
}

export function useResume() {
  const [resume, setResumeState] = useState<ResumeData>(() => loadResume() ?? clone(defaultResume));
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

  const setResume: React.Dispatch<React.SetStateAction<ResumeData>> = (action) => {
    setSaveStatus("saving");
    setResumeState(action);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        saveResume(resume);
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    }, 450);
    return () => window.clearTimeout(timer);
  }, [resume]);

  const updatePersonal = (field: keyof PersonalInformation, value: string) => {
    setResume((current) => ({ ...current, personal: { ...current.personal, [field]: value } }));
  };

  const updateExperience = (id: string, patch: Partial<ExperienceItem>) => {
    setResume((current) => ({ ...current, experience: current.experience.map((item) => item.id === id ? { ...item, ...patch } : item) }));
  };

  const updateAchievement = (id: string, index: number, value: string) => {
    setResume((current) => ({ ...current, experience: current.experience.map((item) => {
      if (item.id !== id) return item;
      const achievements = [...item.achievements];
      achievements[index] = value;
      return { ...item, achievements };
    }) }));
  };

  const addAchievement = (id: string) => setResume((current) => ({ ...current, experience: current.experience.map((item) => item.id === id ? { ...item, achievements: [...item.achievements, ""] } : item) }));
  const removeAchievement = (id: string, index: number) => setResume((current) => ({ ...current, experience: current.experience.map((item) => item.id === id ? { ...item, achievements: item.achievements.filter((_, itemIndex) => itemIndex !== index) } : item) }));
  const addExperience = () => setResume((current) => ({ ...current, experience: [...current.experience, blankExperience()] }));
  const duplicateExperience = (id: string) => setResume((current) => {
    const source = current.experience.find((item) => item.id === id);
    if (!source) return current;
    const copy = { ...clone(source), id: createId("experience") };
    const index = current.experience.findIndex((item) => item.id === id);
    const experience = [...current.experience];
    experience.splice(index + 1, 0, copy);
    return { ...current, experience };
  });
  const removeExperience = (id: string) => setResume((current) => ({ ...current, experience: current.experience.filter((item) => item.id !== id) }));

  const useExample = () => setResume((current) => ({ ...clone(defaultResume), language: current.language }));
  const createEmpty = () => { clearResume(); setResume((current) => ({ ...clone(emptyResume), language: current.language })); };

  return { resume, setResume, saveStatus, updatePersonal, updateExperience, updateAchievement, addAchievement, removeAchievement, addExperience, duplicateExperience, removeExperience, useExample, createEmpty };
}
