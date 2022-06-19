# Oboeru

Oboeru is a card model for the spaced repetition app Anki. Oboeru allows you to write notes like you would write a summary of a topic, and turn this into a highly structured, functional set of flashcards that respect laws of good flashcard design.

## Getting Started

0. install Anki
1. install the model (see [Installation](#installation))
2. if unfamiliar with flashcards, read the [20 rules](https://www.supermemo.com/en/archives1990-2015/articles/20rules)
3. read the documentation below
4. get some sample cards and grok how the system works

## Design

Oboeru has a few overriding design goals:
- Allow notes to mirror the structure of the topic, rather than forcing the structure of the topic to adapt to flashcard formats.
- Allow keeping all the information on a single topic on one note, preventing duplication, coupling and out-of-date information.
- Have flashcards be supremely readable both when editing them as well as when studying them.
- Do all this while conforming to the [20 rules](https://www.supermemo.com/en/archives1990-2015/articles/20rules) and other best-practices.

## Architecture

### Cloze Groups

At the core of Oboeru's design is a cloze group. 
By default, a cloze group is not visible at the front of the card unless an element within is currently being clozed. In the most common case where all currently clozed elements are within the same cloze group, only one cloze group will be visible on the front. All cloze groups will be visible on the back. To show cloze groups, an exclamation mark is used, either the normal `!` or the full-width `！` (for whole sections). Currently, the `!/！ ` is placed at the beginning of the line, except for headings, where it's placed just before the heading string.
Any content on an Oboeru note is within at least one cloze group, or multiple, if nested (the default for most elements).  

### Four Elements

Fundamentally, there are four elements that can define a cloze group: Headed containers, sections, subsections and lines.
Headed containers are defined and begun by a markdown heading. Headed containers will continue until a heading of the same level or higher. That means that deeper headed containers are automatically nested within shallower/higher headed containers.
Within headed containers, any content such as text will be part of a section. The first section is established automatically, subsequent sections are established by two blank lines (i.e. three newlines).
Tables and flex containers require their own section, and do not have subsections. More on them later. All other sections are known as text sections.
Text sections consist of one or more subsections. The first subsection is established automatically, subsequent sections are established by a blank line (i.e. two newlines).
Any subsection consists of one or more lines. A line is established by a single newline (duh).
Table rows functionally work like lines.

### UI

Visually, sections are the most distinct element, appearing as box-like things.  
More deeply nested headed containers will appear more indented in the card output, to get a feeling where in the structure you are.  
Headered containers are also details elements (with their header as the summary), allowing expanding and hiding as needed.

### tables and flex containers

tables, flex containers and onion boxes are begun by `table:` and `flex-container` respectively. 

#### flex containers

Flex containers are what they sound like, flexbox based containers to contain all listed elements. Useful for images and the like. 

#### Tables

Tables are established by a syntax similar to Markdown, but with less lines. This table:

|header1|header2|
|---|---|
|foo|bar|
|baz|quuz|

would be created like this in Oboeru:

```
table:header1|header2
foo|bar
baz|quuz
```

However, they also have more flexiblity: Tables, rows and cells can have more properties specified via specifiers. Specifiers may specify `style` and `class` for tables, rows, and cells, `type` (th or td) and `span` for cells only, and `headerrows` for tables only. Specifiers are separated via `;` and have the syntax `key=value`. Multiple classes and style declarations are separated via spaces (ergo style declarations are not delimited by ; (!)). Span sets rowspan and optionally colspan via a &lt;num>[&lt;num>] syntax (so e.g. span=2; or span=1,3; ).
For tables and rows, the specifier is separated from the body via `,,,`, to prevent parsing confusion (is the specifier for the table, row or first cell?).

### formatting

#### inline

Oboeru supports a set of inline syntax elements for inline formatting. The inline syntax may be split into three rough categories: Markdownlikes, readable escapes, and enbf-formatting.   
Markdownlikes are metacharacters for formatting in a similar way as markdown, for things such as `<b>`, `<u>`, `<code>`, `<dfn>`, etc. Oboeru's syntax for inline elements is *reminiscent* of the syntax used in markdown (where extant), but in fact does not use the more common symbols such as \*, but instead unicode lookalikes such as ＊. This decision may be controversial, however I think the increased readability of the plain source text without needing to escape many characters justifies this decision. I can heartily recommend the text expander `espanso` for inserting these characters easily. This grouping also includes a fair amount of elements which Markdown does not support, such as the aforementioned `<dfn>`, `<sub/sub>`, `<ruby>` = furigana, etc. It even contains syntax for `<img>`, which arguably is not very useful, but allows you to validate your card against containing any of `<>` even if using images.    
Find a full reference of the inline syntax in [the file implementing it](/src/ts/parsing/inline/regex-replacement/index.ts).
Readable escapes are a handful of characters acting as pseudo-escape characters for common characters needing escape in HTML, mainly `＆` for `&` as well as `‹`, `›` for `<`, `>`.  
Finally, there enbf-formatting characters are a set of characters rendering as the ENBF option [], repetition {} and alternation | characters, but distinguished in CSS, to avoid confusion with actual [], {}, | in the object language described. Feel free to ignore these if you do not use ENBF.

#### block

Text sections allow for some block-based formatting, specifically fenced markdown codeblocks,
```
\```potentially code type here for syntax highlighting supported via highlight.js
code here
\```
```
blockquotes,
```
\> I am a blockquote :)
```
lists,
```
1. I am an ordered list element <3
- Unlike markdown, you can mix and match list types.
- but also unlike markdown, you cannot use * or + for your unordered lists
```
as well as arbitrary indentation of any line via spaces.

### Clozelikes

Oboeru replaces anki's native `{{c<n>::}}` clozes with a more featureful syntax of things called clozelikes. Like the inline syntax, these use some obscure unicode parentheses `⟮`, `⟯` to avoid escaping and make the result more readable.

#### Specifiers

Any clozelike has a specifier, though it may be empty. A specifier consists of n action mappings, which are separated by semicolons (including the final one separating the specifier from the content). An action mapping consists of an action name and an action target. Possible action names are:

| action name | does                                                                                   |
|-------------|----------------------------------------------------------------------------------------|
| c           | makes a **c**loze                                                                      |
| h           | **h**ides the contents (on the front)                                                  |
| s           | replaces the contents with dummy text (as if **s**crambled) (on the front)             |
| uh          | **u**n**h**ides the contents (only makes sense in combination with h)                  |
| us          | **u**n**s**crambles the contents (only makes sense in combination with s)              |
| hb          | **h**ides the contents on the **b**ack                                                 |
| uhb         | **u**n**h**ides the contents on the **b**ack (only makes sense in combination with hb) |

Action targets specify which cards the action name applies to. Action targets may consist of one or more action target parts, separated by `,`. An action target part may be universal, relative to the cloze group, or numeric. 
An universal action target part is indicated by ∞ and means 'for all cards'.
A relative action part can be `a` or `b` and means all clozelikes after/before in the cloze group.
A numeric action target part may be a single individual numeric action target part, or a numeric action target part range, which itself consists of two individual numeric action target parts, separated by a `:`.   
An individual numeric action target part may most simply be a number. But it may also be *relative*, which allows you not to keep track of exactly which number the current cloze is. Clozes with a number set the current cloze number to that number. Use +, - and _ to increment/decrement/leave intact the cloze number, and refer to it. Use _+, _- and _+&lt;number>, _-&lt;number> to refer to cloze numbers relatively without changing the current cloze number.  
If the specifier is not specified, it is treated as `c+;`, i.e. increment the cloze number by one. Therefore, for most clozelikes, you will probably not need a specifier at all.
For those that like ENBF, here's clozelikes in ENBF (well, one of the many ENBF dialects):  
```
clozelike ::= ⟮[<specifier>]<content>⟯
content ::= any Unicode string
specifier ::= <action-mapping>{<action-mapping>}
action-mapping ::= <action-name><action-target>;
action-target ::= <action-target-part>{,<action-target-part>}
action-target-part ::= ∞|a|b|<numeric-action-target-part>
numeric-action-target-part ::= <individual-NATP>[:<individual-NATP>]
individual-NATP ::= <number>|<relative-INATP>
relative-INATP ::= [_](+|-)[<number>]
```

#### Hints

As native anki, clozelikes supports hints, here separated by the fullwidth colon `：`.

#### Nesting

Nesting clozelikes is supported, so nest away. 

## Reviewing

During reviewing, the current clozelike will automatically center itself on the screen. Otherwise, reviewing works as normal.

## Installation

1. Clone the repo
2. run `npm install` in the repo directory
3. set the environment variable `ANKI_COLLECTION_MEDIA` to the location of your `collection.media` directory path.
4. run `npm run build`
5. You should now have a `_bundle.css` and `_bundle.js` in your `collection.media` directory.
6. create a card template with:  

    Front:  

    ```
    <link href="_bundle.css" rel="stylesheet">
    <template id="raw-tags">{{Tags}}</template>
    <template id="raw-content">{{cloze:Text}}</template>
    <template id="parsed-container"></template>
    <script src="_bundle.js"></script>
    ```

    Back:  

    ```
    <div class="is-back-indicator"></div>
    <link href="_bundle.css" rel="stylesheet">
    <template id="raw-tags">{{Tags}}</template>
    <template id="raw-content">{{cloze:Text}}</template>
    <template id="parsed-container"></template>
    <script src="_bundle.js"></script>
    ```

    Notice that these are not the same!  
7. Create a note, or use the [example note](/documentation/example-card.md).
8. Ensure that everything works.
9. ???
10. Profit

## Included Tools

Oboeru includes some arcane syntax. For this and for other things, some tools are provided.

### Shortcuts

## Opinionated Usage

### Editing

Edit cards in your code editor of choice. Editing large cards in Anki isn't fun, even with the code highlighting update, and it will sometimes chew up your edits if you're too hasty in closing the editor.

## Limitations

### Anki

Anki does not allow more than 500 clozes per card, sadly. It will also get quite slow to navigate the card browser even before that amout.  

### Oboeru

#### Speed

Oboeru may take in the order of a few 100ms to fully render a big card, which may be unnacceptable to some. There is probably some speed to be gained through code improvements, but this is not a priority for me at this time. PRs welcome!

#### More Inline Formatting

In principle, it is extremely easy to add more inline formatting by editing the relevant .json file. However, inline formatting added imposes the performance penalty of running a (fairly simple, but still) regex over the whole card. Writing a custom parser proved to be 15 times slower, however (perhaps because the JS regex engine can take advantage of JIT compiling better?). Again, ideas for solutions welcome.  

### Interaction

#### Audio/Video

Currently, support for audio/video is nearly nonexistent. Anki's native audio/video will play on every card, and is kind of obnoxious generally. `<audio>`/`<video>` kinda work, but have no styling or usability considerations at the moment. If someone has an idea of how these should work, please feel free to open an issue.

## Glossary

**full-width**: Versions of some characters typically used e.g. in Japanese, which are different characters in Unicode (to the computer, essentially), and thus can be used to easily distinguish functions without having to resort to more complex logic.  