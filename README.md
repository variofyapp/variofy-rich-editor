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

Override the editor CSS variables on a parent class or the editor itself:

```css
.my-editor {
  --ve-background: 222.2 47.4% 11.2%;
  --ve-foreground: 210 40% 98%;
  --ve-muted: 217.2 32.6% 17.5%;
  --ve-muted-foreground: 215 20.2% 65.1%;
  --ve-border: 217.2 32.6% 24%;
  --ve-accent: 217.2 32.6% 20%;
  --ve-accent-foreground: 210 40% 98%;
  --ve-ring: 212.7 26.8% 83.9%;
  --ve-radius: 0.75rem;
}
```

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
