import { Section, Subsection } from "./types";

export function parseTextSection(html: string): Section<string> {
  const subsectionParts = html.trim().split("\n\n");
  const subsections: Subsection<string>[] = subsectionParts.map(
    (subsection) => {
      const lines = subsection.trim().split("\n");
      return { lines };
    }
  );
  return { subsections };
}
