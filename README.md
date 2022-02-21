# Oboeru

Oboeru is a card model for the spaced repetition app Anki. Oboeru allows you to write notes like you would write a summary of a topic, and turn this into a highly structured, functional set of flashcards that respect laws of good flashcard design.

## Design

Oboeru has a few overriding design goals:
- Allow notes to mirror the structure of the topic, rather than forcing the structure of the topic to adapt to flashcard formats.
- Allow keeping all the information on a single topic on one note, preventing duplication, coupling and out-of-date information.
- Have flashcards be supremely readable both when editing them as well as when studying them.
- Do all this while conforming to the [20 rules](https://www.supermemo.com/en/archives1990-2015/articles/20rules) and other best-practices.

## Architecture

### Cloze Groups

Oboeru notes are written with a syntax inspired by markdown.  
At the core of Oboeru's design is a cloze group. 
By default, a cloze group is not visible at the front of the card unless an element within is currently being clozed.  
Any content on an Oboeru note is within one or more cloze groups.  
Cloze groups will often be nested. 

### Four elements

Fundamentally, four elements define a cloze group: Headed containers, sections, subsections and lines.
Headed containers are defined and begun by a markdown heading. Headed containers will continue until a heading of the same level or higher. That means that deeper headed containers are automatically nested within shallower/higher headed containers.
Within headed containers, any content such as text will be part of a section. The first section is established automatically, subsequent sections are established by two blank lines (i.e. three newlines).
Tables, flex containers, and onion boxes require their own section, and do not have subsections. More on them later. All other sections are known as text sections.
Text sections consist of one or more subsections. The first subsection is established automatically, subsequent sections are established by a blank line (i.e. two newlines).
Any subsection consists of one or more lines. A line is established by a single newline (duh).
Table rows functionally work like lines.

### UI

Visually, sections are the most distinct element, appearing as box-like things.  
More deeply nested headed containers will appear more indented in the card output, to get a feeling where in the structure you are

### tables, flex containers and onion boxes

tables, flex containers and onion boxes are begun by `table:`, `flex-container` and `onion-box`, respectively.

#### onion-box

Onion boxes are there to graphically depict subset/superset relationships. After the initial `onion-box:` line, every line provides a label, with the indentation (2 spaces or tabs) indicating how deeply nested it is. TODO unimplemented

#### flex containers

Flex containers are what they sound like, flexbox based containers to contain all listed elements 

### inline syntax

Oboeru supports a set of inline syntax elements for inline formatting for things such as `<b>`, `<u>`, `<code>`, `<dfn>`, etc.  
Oboeru's syntax for inline elements is *reminiscent* of the syntax used in markdown (where extant), but in fact does not use the more common symbols such as \*, but instead unicode lookalikes such as ＊. This decision may be controversial, however I think the increased readability of the plain source text without needing to escape many characters justifies this decision. I can heartily recommend the text expander `espanso` for inserting these characters easily.  
Find a full reference of the inline syntax in [the file implementing it](/src/ts/parsing/inline/regex-replacement/index.ts).

### Clozelikes

Oboeru replaces anki's native `{{c<n>::}}` clozes with a more featureful syntax of things called clozelikes.

## TODO

Inline formatting only on visible stuff.
Image own syntax.
Abstract tree parsing away.