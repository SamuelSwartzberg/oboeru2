export function lastElement<T>(arr: T[]): T {
  return nthLastElement(arr, 0);
}
export function nthLastElement<T>(arr: T[], n: number): T {
  return arr[arr.length - n - 1];
}
