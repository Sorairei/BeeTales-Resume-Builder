import { resumePdfFileName } from "../utils/fileNames";

export function printResume(fullName: string): void {
  const previousTitle = document.title;
  document.title = resumePdfFileName(fullName).replace(/\.pdf$/, "");
  const restore = () => { document.title = previousTitle; window.removeEventListener("afterprint", restore); };
  window.addEventListener("afterprint", restore);
  window.print();
  window.setTimeout(restore, 1500);
}
