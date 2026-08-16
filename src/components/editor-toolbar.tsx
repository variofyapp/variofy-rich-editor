import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Separator from "@radix-ui/react-separator";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  ChevronDown,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline,
  Undo2,
  Unlink2,
} from "lucide-react";
import { Fragment, type ReactNode } from "react";

import { Button } from "./ui/button";
import { ToolbarButton } from "./toolbar-button";
import { TableMenu } from "./table-menu";

/**
 * Every control the built-in toolbar can render, in the order it renders them.
 *
 * A host that narrows the schema also has to narrow this list: a button for a
 * node the editor does not register is a button that does nothing.
 */
export const TOOLBAR_TOOLS = [
  "heading",
  "bold",
  "italic",
  "underline",
  "strike",
  "code",
  "bulletList",
  "orderedList",
  "blockquote",
  "table",
  "link",
  "unlink",
  "clearFormatting",
  "undo",
  "redo",
] as const;

export type ToolbarTool = (typeof TOOLBAR_TOOLS)[number];

export interface EditorToolbarProps {
  editor: Editor;
  /** Controls to render. Defaults to all of them. */
  tools?: readonly ToolbarTool[];
  /**
   * Opens the host's own link UI. Without it the toolbar falls back to
   * `window.prompt`, which cannot validate an address before it is applied.
   */
  onEditLink?: (editor: Editor) => void;
}

const textStyles = [
  { label: "Paragraph", icon: Pilcrow, level: null },
  { label: "Heading 1", icon: Heading1, level: 1 as const },
  { label: "Heading 2", icon: Heading2, level: 2 as const },
  { label: "Heading 3", icon: Heading3, level: 3 as const },
];

function currentTextStyle(editor: Editor) {
  const heading = textStyles.find(
    (style) => style.level && editor.isActive("heading", { level: style.level }),
  );
  return heading ?? textStyles[0];
}

function promptForLink(editor: Editor) {
  const oldUrl = editor.getAttributes("link").href as string | undefined;
  const url = window.prompt("Enter a URL", oldUrl ?? "https://");

  if (url === null) return;
  if (url.trim() === "") {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }

  editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
}

function TextStyleMenu({ editor }: { editor: Editor }) {
  const style = currentTextStyle(editor);
  const StyleIcon = style.icon;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="ve-style-trigger"
          aria-label="Text style"
        >
          <StyleIcon size={17} />
          <span>{style.label}</span>
          <ChevronDown size={14} className="ve-style-trigger__chevron" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="ve-dropdown"
        >
          {textStyles.map(({ label, icon: Icon, level }) => (
            <DropdownMenu.Item
              key={label}
              className="ve-dropdown__item"
              onSelect={() => {
                if (level) {
                  editor.chain().focus().toggleHeading({ level }).run();
                } else {
                  editor.chain().focus().setParagraph().run();
                }
              }}
            >
              <Icon size={17} />
              {label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function EditorToolbar({
  editor,
  tools = TOOLBAR_TOOLS,
  onEditLink,
}: EditorToolbarProps) {
  const has = (tool: ToolbarTool) => tools.includes(tool);
  const editLink = () =>
    onEditLink ? onEditLink(editor) : promptForLink(editor);

  const control = (tool: ToolbarTool, node: () => ReactNode) =>
    has(tool) ? <Fragment key={tool}>{node()}</Fragment> : null;

  // Grouped so that narrowing `tools` never leaves a separator with nothing on
  // one side of it.
  const groups: ReactNode[][] = [
    [control("heading", () => <TextStyleMenu editor={editor} />)],
    [
      control("bold", () => (
        <ToolbarButton
          label="Bold"
          icon={Bold}
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
      )),
      control("italic", () => (
        <ToolbarButton
          label="Italic"
          icon={Italic}
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
      )),
      control("underline", () => (
        <ToolbarButton
          label="Underline"
          icon={Underline}
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
      )),
      control("strike", () => (
        <ToolbarButton
          label="Strikethrough"
          icon={Strikethrough}
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
      )),
      control("code", () => (
        <ToolbarButton
          label="Inline code"
          icon={Code2}
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        />
      )),
    ],
    [
      control("bulletList", () => (
        <ToolbarButton
          label="Bullet list"
          icon={List}
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
      )),
      control("orderedList", () => (
        <ToolbarButton
          label="Ordered list"
          icon={ListOrdered}
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
      )),
      control("blockquote", () => (
        <ToolbarButton
          label="Blockquote"
          icon={Quote}
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
      )),
      control("table", () => <TableMenu editor={editor} />),
    ],
    [
      control("link", () => (
        <ToolbarButton
          label="Add or edit link"
          icon={Link2}
          active={editor.isActive("link")}
          onClick={editLink}
        />
      )),
      control("unlink", () => (
        <ToolbarButton
          label="Remove link"
          icon={Unlink2}
          disabled={!editor.isActive("link")}
          onClick={() => editor.chain().focus().unsetLink().run()}
        />
      )),
      control("clearFormatting", () => (
        <ToolbarButton
          label="Clear formatting"
          icon={RemoveFormatting}
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        />
      )),
    ],
  ].map((group) => group.filter(Boolean));

  const history: ReactNode[] = [
    control("undo", () => (
      <ToolbarButton
        label="Undo"
        icon={Undo2}
        disabled={!editor.can().chain().focus().undo().run()}
        onClick={() => editor.chain().focus().undo().run()}
      />
    )),
    control("redo", () => (
      <ToolbarButton
        label="Redo"
        icon={Redo2}
        disabled={!editor.can().chain().focus().redo().run()}
        onClick={() => editor.chain().focus().redo().run()}
      />
    )),
  ].filter(Boolean);

  const filled = groups.filter((group) => group.length > 0);

  return (
    <div className="ve-toolbar" role="toolbar" aria-label="Text formatting">
      {filled.map((group, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <Separator.Root className="ve-separator" orientation="vertical" />
          )}
          {group}
        </Fragment>
      ))}

      {history.length > 0 && (
        <>
          <span className="ve-toolbar__spacer" />
          {history}
        </>
      )}
    </div>
  );
}
