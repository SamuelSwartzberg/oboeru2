export function saveFrontToBack(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value); // for one platform session storage works
  } catch (e) {
    (window as any)[key] = value; // for another plattform saving on the window object works
  }
}

function deleteKey(key: string): void {
  try {
    sessionStorage.removeItem(key); // for one platform session storage works
  } catch (e) {
    delete (window as any)[key]; // for another plattform deleting on the window object works
  }
}

function loadKey(key: string): string {
  try {
    return sessionStorage.getItem(key) || "";
  } catch (e) {
    return (window as any)[key];
  }
}

export function loadFromFront(key: string, preserve: boolean): string {
  const tempSessionStorageItem = loadKey(key);

  if (!preserve) {
    deleteKey(key);
  }
  return tempSessionStorageItem;
}
