import { referenceFiles } from "@/references/index";

export function loadReferences(refNames: string[]): string[] {
  return refNames.map(name => {
    const content = referenceFiles[name];
    if (!content) {
      console.warn(`Reference not found: ${name}`);
      return "";
    }
    return content;
  }).filter(Boolean);
}
