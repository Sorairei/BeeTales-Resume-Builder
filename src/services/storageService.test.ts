import { afterEach, describe, expect, it, vi } from "vitest";
import { defaultResume } from "../data/defaultResume";
import { clearResume, loadResume, saveResume, STORAGE_KEY } from "./storageService";

function useMemoryStorage(initialValue?: string) {
  const values = new Map<string, string>();
  if (initialValue !== undefined) values.set(STORAGE_KEY, initialValue);
  const storage = {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => values.set(key, value)),
    removeItem: vi.fn((key: string) => values.delete(key)),
  };
  vi.stubGlobal("localStorage", storage);
  return storage;
}

afterEach(() => vi.unstubAllGlobals());

describe("local resume persistence", () => {
  it("saves and restores validated resume data", () => {
    const storage = useMemoryStorage();
    saveResume(defaultResume);

    expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(defaultResume));
    expect(loadResume()).toEqual(defaultResume);
  });

  it("ignores corrupt or incompatible saved data", () => {
    useMemoryStorage("{broken-json");
    expect(loadResume()).toBeNull();

    useMemoryStorage(JSON.stringify({ ...defaultResume, version: 99 }));
    expect(loadResume()).toBeNull();
  });

  it("removes only the BeeTales resume key", () => {
    const storage = useMemoryStorage(JSON.stringify(defaultResume));
    clearResume();

    expect(storage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    expect(loadResume()).toBeNull();
  });
});
