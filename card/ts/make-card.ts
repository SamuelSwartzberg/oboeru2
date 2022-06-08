import { makeTextContent } from "./make-text-content";
import { getRaw } from "./webview-interface/anki/get-raw";
import { makeCardTemplate } from "./make-card-template";
import {
  getContentContainer,
  getTempContainer,
} from "./webview-interface/anki/get-containers";
import { doInAnkiEnv } from "./webview-interface/anki/do-in-anki-env";

export function makeCard() {
  doInAnkiEnv(() => {
    let cardTemplate = makeCardTemplate(
      getTempContainer(),
      makeTextContent(getRaw())
    );
    getContentContainer().appendChild(cardTemplate);
  });
}
