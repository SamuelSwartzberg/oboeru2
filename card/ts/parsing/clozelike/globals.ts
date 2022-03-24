export type possiblyRecursiveTArrayElement<T> = T | possiblyRecursiveTArray<T>;
export type possiblyRecursiveTArray<T> = possiblyRecursiveTArrayElement<T>[];
