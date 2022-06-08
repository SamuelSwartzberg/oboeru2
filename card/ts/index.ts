import log from "loglevel";
import { makeCard } from "./make-text-content";
import { getRaw } from "./webview-interface/anki/get-raw";
import { makeCardTemplate } from "./make-card-template";
import {
  getContentContainer,
  getTempContainer,
} from "./webview-interface/anki/get-containers";
import { doInAnkiEnv } from "./webview-interface/anki/do-in-anki-env";

log.setLevel("info");
log.info("Log active.");

doInAnkiEnv(() => {
  let cardTemplate = makeCardTemplate(getTempContainer(), makeCard(getRaw()));
  getContentContainer().appendChild(cardTemplate);
});
