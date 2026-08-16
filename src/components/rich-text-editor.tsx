"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import type { CSSProperties, ReactNode } from "react";
import type {
  EditorOptions,
  Extensions,
  JSONContent,
} from "@tiptap/core";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { TableKit } from "@tiptap/extension-table";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { cn } from "../lib/utils";
import { EditorToolbar } from "./editor-toolbar";
import { TooltipProvider } from "./ui/tooltip";

const EMPTY_DOCUMENT = "<p></p>";
const EMPTY_EXTENSIONS: Extensions = [];

export interface RichTextEditorUpdate {
  editor: Editor;
  html: string;
  json: JSONContent;
  text: string;
}

export interface RichTextEditorRef {
  getEditor: () => Editor | null;
  focus: () => void;
  clear: () => void;
}

export interface RichTextEditorProps {
  /** Controlled HTML value. */
  value?: string;
  /** Initial HTML for uncontrolled usage. */
  defaultValue?: string;
  /** Called after a user or command changes the document. */
  onChange?: (html: string, update: RichTextEditorUpdate) => void;
  /** Called when the Tiptap editor instance is ready. */
  onCreate?: (editor: Editor) => void;
  placeholder?: string;
  editable?: boolean;
  autoFocus?: boolean | "start" | "end" | "all" | number;
  extensions?: Extensions;
  editorProps?: EditorOptions["editorProps"];
  toolbar?: boolean | ((editor: Editor) => ReactNode);
  className?: string;
  contentClassName?: string;
  minHeight?: number | string;
  ariaLabel?: string;
}

function getWordCount(text: string) {
  const normalized = text.trim();
  return normalized ? normalized.split(/\s+/u).length : 0;
}

export const RichTextEditor = forwardRef<
  RichTextEditorRef,
  RichTextEditorProps
>(
  (
    {
      value,
      defaultValue,
      onChange,
      onCreate,
      placeholder = "Start writing…",
      editable = true,
      autoFocus = false,
      extensions = EMPTY_EXTENSIONS,
      editorProps,
      toolbar = true,
      className,
      contentClassName,
      minHeight = 240,
      ariaLabel = "Rich text editor",
    },
    ref,
  ) => {
    const callbacks = useRef({ onChange, onCreate });
    callbacks.current = { onChange, onCreate };

    const configuredExtensions = useMemo(
      () => [
        StarterKit.configure({
          link: false,
        }),
        Link.configure({
          autolink: true,
          linkOnPaste: true,
          openOnClick: false,
          HTMLAttributes: {
            rel: "noopener noreferrer nofollow",
            target: "_blank",
          },
        }),
        Placeholder.configure({ placeholder }),
        TableKit.configure({
          table: {
            resizable: true,
            lastColumnResizable: false,
            allowTableNodeSelection: true,
          },
        }),
        ...extensions,
      ],
      [extensions, placeholder],
    );

    const editor = useEditor(
      {
        extensions: configuredExtensions,
        content: value ?? defaultValue ?? EMPTY_DOCUMENT,
        editable,
        autofocus: autoFocus,
        immediatelyRender: false,
        shouldRerenderOnTransaction: true,
        editorProps: {
          ...editorProps,
          attributes: (state) => {
            const suppliedAttributes =
              typeof editorProps?.attributes === "function"
                ? editorProps.attributes(state)
                : editorProps?.attributes;

            return {
              ...suppliedAttributes,
              class: cn("ve-content", contentClassName, suppliedAttributes?.class),
              role: "textbox",
              "aria-label": ariaLabel,
              "aria-multiline": "true",
            };
          },
        },
        onCreate: ({ editor: instance }) => callbacks.current.onCreate?.(instance),
        onUpdate: ({ editor: instance }) => {
          const html = instance.getHTML();
          callbacks.current.onChange?.(html, {
            editor: instance,
            html,
            json: instance.getJSON(),
            text: instance.getText(),
          });
        },
      },
      [configuredExtensions],
    );

    useEffect(() => {
      editor?.setEditable(editable);
    }, [editable, editor]);

    useEffect(() => {
      if (!editor || value === undefined || value === editor.getHTML()) return;
      editor.commands.setContent(value, { emitUpdate: false });
    }, [editor, value]);

    useImperativeHandle(
      ref,
      () => ({
        getEditor: () => editor,
        focus: () => editor?.chain().focus().run(),
        clear: () => editor?.commands.clearContent(),
      }),
      [editor],
    );

    if (!editor) {
      return <div className={cn("ve-editor ve-editor--loading", className)} />;
    }

    const text = editor.getText();
    const wordCount = getWordCount(text);

    return (
      <TooltipProvider delayDuration={350}>
        <div
          className={cn("ve-editor", !editable && "ve-editor--readonly", className)}
          style={{ "--ve-min-height": typeof minHeight === "number" ? `${minHeight}px` : minHeight } as CSSProperties}
        >
          {toolbar === true && editable ? <EditorToolbar editor={editor} /> : null}
          {typeof toolbar === "function" && editable ? toolbar(editor) : null}
          <EditorContent editor={editor} />
          <div className="ve-footer" aria-live="polite">
            <span>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
            <span>{text.length} characters</span>
          </div>
        </div>
      </TooltipProvider>
    );
  },
);

RichTextEditor.displayName = "RichTextEditor";
