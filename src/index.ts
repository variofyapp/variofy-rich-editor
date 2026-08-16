import "./styles/editor.css";

// Re-exported because every callback here hands one back, and a host that only
// depends on this package has nowhere else to name the type from.
export type { Editor } from "@tiptap/react";
export { RichTextEditor } from "./components/rich-text-editor";
export type {
  RichTextEditorFooter,
  RichTextEditorProps,
  RichTextEditorRef,
  RichTextEditorUpdate,
} from "./components/rich-text-editor";
export { EditorToolbar, TOOLBAR_TOOLS } from "./components/editor-toolbar";
export type {
  EditorToolbarProps,
  ToolbarTool,
} from "./components/editor-toolbar";
export { TableMenu } from "./components/table-menu";
export type { TableMenuProps } from "./components/table-menu";
export { Button, buttonVariants } from "./components/ui/button";
export type { ButtonProps } from "./components/ui/button";
export { cn } from "./lib/utils";
