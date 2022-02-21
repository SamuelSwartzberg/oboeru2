function replaceContinuingLineIndicatorsWithBrs(html: string): string {
  return html.replace(/¶\n?\s*/g, "<br>");
}

export function preformatHTML(html: string): string {
  return replaceContinuingLineIndicatorsWithBrs(html);
}
