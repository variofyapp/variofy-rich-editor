"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { EditorOptions, Extensions, JSONContent } from "@tiptap/core";
import Link, { type LinkOptions } from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { TableKit } from "@tiptap/extension-table";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit, { type StarterKitOptions } from "@tiptap/starter-kit";

import { cn } from "../lib/utils";
import { EditorToolbar, type ToolbarTool } from "./editor-toolbar";
import { TooltipProvider } from "./ui/tooltip";

const EMPTY_DOCUMENT = "<p></p>";
const EMPTY_EXTENSIONS: Extensions = [];

export interface RichTextEditorUpdate {
  editor: Editor;
  html: string;
  json: JSONContent;
  text: string;
  /** True while the document holds nothing a reader would see. */
  isEmpty: boolean;
}

export interface RichTextEditorFooter {
  editor: Editor;
  text: string;
  words: number;
  characters: number;
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
  /**
   * Options for the bundled `StarterKit`, or `false` to leave it out. Its own
   * `link` entry is always disabled because links are registered separately
   * through `link`.
   *
   * Set an entry to `false` to keep its node or mark out of the schema, which
   * is the only way to stop the document holding markup the host cannot store:
   * ProseMirror will not create a node its schema does not define, not even on
   * paste.
   */
  starterKit?: Partial<StarterKitOptions> | false;
  /** Options for the link mark, or `false` to leave links out of the schema. */
  link?: Partial<LinkOptions> | false;
  /** Registers table support. Defaults to `true`. */
  table?: boolean;
  /** Placeholder text, or `false` to leave the placeholder out. */
  placeholder?: string | false;
  editable?: boolean;
  autoFocus?: boolean | "start" | "end" | "all" | number;
  extensions?: Extensions;
  editorProps?: EditorOptions["editorProps"];
  toolbar?: boolean | ((editor: Editor) => ReactNode);
  /** Which built-in toolbar controls to render. Defaults to all of them. */
  tools?: readonly ToolbarTool[];
  /** Opens the host's own link UI instead of `window.prompt`. */
  onEditLink?: (editor: Editor) => void;
  /**
   * The bar under the document: the word and character count by default, `false`
   * for none, or a render function for the host's own summary.
   */
  footer?: boolean | ((state: RichTextEditorFooter) => ReactNode);
  className?: string;
  /**
   * Styles for the editor's outer element, and where its `--ve-*` tokens are
   * usually answered: the defaults are unlayered, so a host that keeps its own
   * design tokens in a cascade layer — every Tailwind 4 application does —
   * cannot override them with a class.
   */
  style?: CSSProperties;
  contentClassName?: string;
  minHeight?: number | string;
  ariaLabel?: string;
}

function getWordCount(text: string) {
  const normalized = text.trim();
  return normalized ? normalized.split(/\s+/u).length : 0;
}

function buildExtensions({
  starterKit,
  link,
  table,
  placeholder,
  extensions,
}: {
  starterKit: Partial<StarterKitOptions> | false | undefined;
  link: Partial<LinkOptions> | false | undefined;
  table: boolean;
  placeholder: string | false;
  extensions: Extensions;
}): Extensions {
  const configured: Extensions = [];

  if (starterKit !== false) {
    configured.push(StarterKit.configure({ ...starterKit, link: false }));
  }

  if (link !== false) {
    configured.push(
      Link.configure({
        autolink: true,
        linkOnPaste: true,
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
        ...link,
      }),
    );
  }

  if (placeholder !== false) {
    configured.push(Placeholder.configure({ placeholder }));
  }

  if (table) {
    configured.push(
      TableKit.configure({
        table: {
          resizable: true,
          lastColumnResizable: false,
          allowTableNodeSelection: true,
        },
      }),
    );
  }

  return [...configured, ...extensions];
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
      starterKit,
      link,
      table = true,
      placeholder = "Start writing…",
      editable = true,
      autoFocus = false,
      extensions = EMPTY_EXTENSIONS,
      editorProps,
      toolbar = true,
      tools,
      onEditLink,
      footer = true,
      className,
      style,
      contentClassName,
      minHeight = 240,
      ariaLabel = "Rich text editor",
    },
    ref,
  ) => {
    // Read on every render, used by callbacks the editor holds from mount.
    const latest = useRef({ onChange, onCreate, contentClassName, ariaLabel });
    latest.current = { onChange, onCreate, contentClassName, ariaLabel };

    // The schema is settled once, at mount. Rebuilding it would replace the
    // editor, and with it the caret, the selection, and the undo history; a
    // host that needs a different configuration should remount with a `key`.
    const configured = useRef<Extensions | null>(null);
    configured.current ??= buildExtensions({
      starterKit,
      link,
      table,
      placeholder,
      extensions,
    });

    const editor = useEditor(
      {
        extensions: configured.current,
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
              class: cn(
                "ve-content",
                latest.current.contentClassName,
                suppliedAttributes?.class,
              ),
              role: "textbox",
              "aria-label": latest.current.ariaLabel,
              "aria-multiline": "true",
            };
          },
        },
        onCreate: ({ editor: instance }) => latest.current.onCreate?.(instance),
        onUpdate: ({ editor: instance }) => {
          // Tiptap can flush a scheduled update after the component holding it
          // has unmounted, and a destroyed editor has no schema left to read
          // the document back through.
          if (instance.isDestroyed) return;

          const html = instance.getHTML();
          latest.current.onChange?.(html, {
            editor: instance,
            html,
            json: instance.getJSON(),
            text: instance.getText(),
            isEmpty: instance.isEmpty,
          });
        },
      },
      [],
    );

    useEffect(() => {
      editor?.setEditable(editable);
    }, [editable, editor]);

    useEffect(() => {
      // The editor owns its document while the caret is in it. Only an outside
      // change — a form reset, or a move to another record — is written back,
      // because re-setting what the user just typed would move their caret.
      if (!editor || editor.isDestroyed || value === undefined) return;
      if (editor.isFocused || value === editor.getHTML()) return;

      // A host that stores emptiness as "" still has the editor's own `<p></p>`
      // in front of it, and those two mean the same document.
      if (value === "" && editor.isEmpty) return;

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

    const outerStyle = {
      ...style,
      "--ve-min-height":
        typeof minHeight === "number" ? `${minHeight}px` : minHeight,
    } as CSSProperties;

    if (!editor) {
      return (
        <div
          className={cn("ve-editor ve-editor--loading", className)}
          style={outerStyle}
        />
      );
    }

    const text = editor.getText();
    const wordCount = getWordCount(text);
    const footerContent =
      footer === false ? null : (
        typeof footer === "function" ? (
          footer({ editor, text, words: wordCount, characters: text.length })
        ) : (
          <>
            <span>
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
            <span>{text.length} characters</span>
          </>
        )
      );

    return (
      <TooltipProvider delayDuration={350}>
        <div
          className={cn(
            "ve-editor",
            !editable && "ve-editor--readonly",
            className,
          )}
          style={outerStyle}
        >
          {toolbar === true && editable ? (
            <EditorToolbar editor={editor} tools={tools} onEditLink={onEditLink} />
          ) : null}
          {typeof toolbar === "function" && editable ? toolbar(editor) : null}
          <EditorContent editor={editor} />
          {footerContent ? (
            <div className="ve-footer" aria-live="polite">
              {footerContent}
            </div>
          ) : null}
        </div>
      </TooltipProvider>
    );
  },
);

RichTextEditor.displayName = "RichTextEditor";
