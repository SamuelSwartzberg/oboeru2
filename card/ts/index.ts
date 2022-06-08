import log from "loglevel";
import { makeCard } from "./make-card";

log.setLevel("info");
log.info("Log active.");

makeCard();
