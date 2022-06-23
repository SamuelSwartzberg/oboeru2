export function matchNotEscaped(arg: string): string {
  return `(?<!\\\\)${arg}`;
}

export function matchUntil(arg: string): string {
  return `([^${arg}]+)`;
}
