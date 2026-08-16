# Variofy Rich Editor

A polished, extensible React rich text editor powered by [Tiptap](https://tiptap.dev/) and shadcn-style Radix primitives. It ships with TypeScript declarations, ESM and CommonJS builds, accessible controls, SSR-safe rendering, and themeable CSS.

## Install

```bash
npm install variofy-rich-editor
```

The host application must provide React 18.2 or newer.

## Quick start

```tsx
import { useState } from "react";
import { RichTextEditor } from "variofy-rich-editor";
import "variofy-rich-editor/styles.css";

export function PostEditor() {
  const [html, setHtml] = useState("<p>Hello world</p>");

  return (
    <RichTextEditor
      value={html}
      onChange={setHtml}
      placeholder="Write your post…"
    />
  );
}
```

For uncontrolled usage, replace `value` with `defaultValue`. A ref exposes `getEditor()`, `focus()`, and `clear()`.

## Extend Tiptap

Pass any Tiptap extensions through `extensions`:

```tsx
import CharacterCount from "@tiptap/extension-character-count";

<RichTextEditor extensions={[CharacterCount.configure({ limit: 10_000 })]} />;
```

You can also replace the built-in toolbar:

```tsx
<RichTextEditor toolbar={(editor) => <MyToolbar editor={editor} />} />
```

The configuration is read once, when the editor mounts. Rebuilding a schema
would replace the editor and take the caret, the selection, and the undo history
with it, so pass a `key` when a different configuration has to take effect.

## Restrict what a document may hold

An application that stores its own markup usually accepts less than the editor
can produce. Turn off what the schema must not contain: ProseMirror will not
create a node its schema does not define, not even on paste, so the writer never
watches their formatting disappear on save.

```tsx
<RichTextEditor
  starterKit={{
    heading: false,
    blockquote: false,
    code: false,
    codeBlock: false,
    horizontalRule: false,
    strike: false,
  }}
  table={false}
  link={{ isAllowedUri: (url) => url.startsWith("https://") }}
  tools={["bold", "italic", "underline", "bulletList", "orderedList", "link", "unlink"]}
/>
```

`tools` names the built-in controls to render, in the order listed in
`TOOLBAR_TOOLS`; separators collapse around the ones left out. `link: false`
drops links from the schema entirely, and `starterKit: false` leaves the base
kit out so `extensions` can supply everything.

Link editing falls back to `window.prompt`, which cannot check an address before
it is applied. Hand the toolbar your own dialog instead:

```tsx
<RichTextEditor onEditLink={(editor) => openLinkDialog(editor)} />
```

## Footer

The bar under the document counts words and characters. Pass `footer={false}` to
drop it, or a function to render your own:

```tsx
<RichTextEditor
  footer={({ characters }) => <span>{characters} / 2000</span>}
/>
```

## Tables

Tables are enabled by default. Open the table menu to choose a size up to 6 × 6. When the cursor is inside a table, the same menu provides row, column, header, merge, split, resize, and delete actions.

The underlying Tiptap commands remain available through the editor instance:

```tsx
editor.commands.insertTable({ rows: 3, cols: 4, withHeaderRow: true });
editor.commands.addRowAfter();
editor.commands.addColumnBefore();
editor.commands.deleteTable();
```

## Theme

Each token holds a complete color, so it takes any value the host already uses —
a hex, an `oklch()`, or one of its own variables.

The defaults are unlayered, and unlayered CSS outranks every cascade layer. An
application that keeps its own tokens in a layer — every Tailwind 4 application
does — has to answer them from `style` rather than from a class:

```tsx
<RichTextEditor
  style={{
    "--ve-background": "var(--background)",
    "--ve-border": "var(--border)",
    "--ve-ring": "var(--ring)",
  } as CSSProperties}
/>
```

Anywhere else, a rule of your own is enough:

```css
.my-editor {
  --ve-background: var(--background);
  --ve-foreground: var(--foreground);
  --ve-muted: var(--muted);
  --ve-muted-foreground: var(--muted-foreground);
  --ve-border: var(--border);
  --ve-accent: var(--accent);
  --ve-accent-foreground: var(--accent-foreground);
  --ve-ring: var(--ring);
  --ve-destructive: var(--destructive);
  --ve-radius: 0.75rem;
}
```

Translucent states are mixed from those tokens, so a dark theme only has to swap
the colors themselves.

## Development

```bash
npm install
npm run dev
```

Before publishing:

```bash
npm run check
npm pack --dry-run
npm login
npm publish
```

Update the repository URLs and author in `package.json` before the first release if the package will live somewhere else. The unscoped name must also be available on npm; otherwise choose a scope such as `@variofy/rich-editor`.

## License

MIT
