import { initBackness, scrollClozeIntoView } from "../../anki-card";

export function doInAnkiEnv(func: () => void): void {
  window.setTimeout(() => {
    initBackness();

    func();

    let numberIntervalsRemaining = 5;
    let interval = window.setInterval(() => {
      if (numberIntervalsRemaining === 0) {
        window.clearInterval(interval);
        return;
      } else numberIntervalsRemaining--;
      scrollClozeIntoView();
    }, 100);
  }, 0);
}
