var readyMap = new Map<string, Date>();

export function isReady(id: string, delay: number = 0): boolean {
  if (!readyMap.has(id)) {
    readyMap.set(id, new Date());
    return true;
  } // we haven't used this id yet, so it's ready by default
  else {
    // we've used this id before, so check if it's ready
    let lastUsed = readyMap.get(id) as Date; // we know that it exists, see above
    let now = new Date();
    if (now.getTime() - lastUsed.getTime() > delay) {
      // it's ready, so let it be used and update the last used time
      readyMap.set(id, now);
      return true;
    }
    return false;
  }
}
