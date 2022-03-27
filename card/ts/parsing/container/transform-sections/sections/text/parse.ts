import { Section, Subsection } from "./types";

export function parseTextSection(html: string): Section<string> {
  const subsectionParts = html.split("\n\n");
  const subsections: Subsection<string>[] = subsectionParts.map(
    (subsection) => {
      const lines = subsection.split("\n");
      return { lines };
    }
  );
  return { subsections };
}
