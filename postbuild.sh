#! /usr/bin/env bash

[[ -z "$ANKI_COLLECTION_MEDIA" ]] && exit 1; 
cp dist/card/anki_bundle.js dist/card/bundle.css "$ANKI_COLLECTION_MEDIA";
[[ -z "$MFLASHCARDS" ]] && exit 1;
cp dist/card/web_bundle.js dist/card/bundle.css "$MFLASHCARDS"/serve;