function replaceContinuingLineIndicatorsWithBrs(html: string): string {
  return html.replace(/¶\n/g, "<br>");
}

export function preformatHTML(html: string): string {
  return replaceContinuingLineIndicatorsWithBrs(html);
}
