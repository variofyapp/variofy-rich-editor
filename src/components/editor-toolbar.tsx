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

import { Button } from "./ui/button";
import { ToolbarButton } from "./toolbar-button";
import { TableMenu } from "./table-menu";

export interface EditorToolbarProps {
  editor: Editor;
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

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const style = currentTextStyle(editor);
  const StyleIcon = style.icon;

  const editLink = () => {
    const oldUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter a URL", oldUrl ?? "https://");

    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="ve-toolbar" role="toolbar" aria-label="Text formatting">
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

      <Separator.Root className="ve-separator" orientation="vertical" />

      <ToolbarButton
        label="Bold"
        icon={Bold}
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        label="Italic"
        icon={Italic}
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        label="Underline"
        icon={Underline}
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ToolbarButton
        label="Strikethrough"
        icon={Strikethrough}
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <ToolbarButton
        label="Inline code"
        icon={Code2}
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />

      <Separator.Root className="ve-separator" orientation="vertical" />

      <ToolbarButton
        label="Bullet list"
        icon={List}
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        label="Ordered list"
        icon={ListOrdered}
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        label="Blockquote"
        icon={Quote}
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <TableMenu editor={editor} />

      <Separator.Root className="ve-separator" orientation="vertical" />

      <ToolbarButton
        label="Add or edit link"
        icon={Link2}
        active={editor.isActive("link")}
        onClick={editLink}
      />
      <ToolbarButton
        label="Remove link"
        icon={Unlink2}
        disabled={!editor.isActive("link")}
        onClick={() => editor.chain().focus().unsetLink().run()}
      />
      <ToolbarButton
        label="Clear formatting"
        icon={RemoveFormatting}
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
      />

      <span className="ve-toolbar__spacer" />

      <ToolbarButton
        label="Undo"
        icon={Undo2}
        disabled={!editor.can().chain().focus().undo().run()}
        onClick={() => editor.chain().focus().undo().run()}
      />
      <ToolbarButton
        label="Redo"
        icon={Redo2}
        disabled={!editor.can().chain().focus().redo().run()}
        onClick={() => editor.chain().focus().redo().run()}
      />
    </div>
  );
}
