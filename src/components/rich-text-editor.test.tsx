import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mergeAttributes } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import { createRef } from "react";

import {
  RichTextEditor,
  type RichTextEditorRef,
} from "./rich-text-editor";

describe("RichTextEditor", () => {
  it("renders the initial document and formatting toolbar", async () => {
    render(<RichTextEditor defaultValue="<p>Hello editor</p>" />);

    await waitFor(() => expect(screen.getByRole("textbox")).toBeTruthy());
    expect(screen.getByText("Hello editor")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Bold" })).toBeTruthy();
  });

  it("exposes the Tiptap instance through its ref", async () => {
    const ref = createRef<RichTextEditorRef>();
    render(<RichTextEditor ref={ref} defaultValue="<p>Ref content</p>" />);

    await waitFor(() => expect(ref.current?.getEditor()).toBeTruthy());
    expect(ref.current?.getEditor()?.getText()).toBe("Ref content");
  });

  it("does not render inherited attributes merged by custom extensions", async () => {
    // GHSA-cp6q-959q-f8rh: JSON can carry an own __proto__ key. Merging
    // attributes in a host's extension must not turn it into DOM attributes.
    const attributes = JSON.parse(
      '{"__proto__":{"data-inherited-marker":"untrusted"},"class":"safe-link"}',
    );
    const customLink = Link.extend({
      renderHTML({ HTMLAttributes }) {
        return ["a", mergeAttributes(HTMLAttributes, attributes), 0];
      },
    });

    render(
      <RichTextEditor
        link={false}
        extensions={[customLink]}
        defaultValue='<p><a href="https://example.com">Safe link</a></p>'
      />,
    );

    const link = await screen.findByRole("link", { name: "Safe link" });
    expect(link.classList.contains("safe-link")).toBe(true);
    expect(link.hasAttribute("data-inherited-marker")).toBe(false);
  });

  it("hides editing controls in read-only mode", async () => {
    render(<RichTextEditor editable={false} defaultValue="<p>Read only</p>" />);

    await waitFor(() => expect(screen.getByRole("textbox")).toBeTruthy());
    expect(screen.queryByRole("toolbar")).toBeNull();
  });

  it("keeps disabled nodes out of the schema, including on paste", async () => {
    const ref = createRef<RichTextEditorRef>();
    render(
      <RichTextEditor
        ref={ref}
        table={false}
        starterKit={{ heading: false, blockquote: false, codeBlock: false }}
        tools={["bold", "italic", "bulletList", "link"]}
        defaultValue="<h1>Heading</h1><blockquote><p>Quoted</p></blockquote>"
      />,
    );

    await waitFor(() => expect(ref.current?.getEditor()).toBeTruthy());

    const html = ref.current!.getEditor()!.getHTML();
    expect(html).not.toContain("<h1");
    expect(html).not.toContain("<blockquote");
    // The words survive even though their formatting does not.
    expect(ref.current!.getEditor()!.getText()).toContain("Heading");
  });

  it("renders only the requested toolbar controls", async () => {
    const onEditLink = vi.fn();
    render(
      <RichTextEditor
        tools={["bold", "italic", "link"]}
        onEditLink={onEditLink}
        defaultValue="<p>Tools</p>"
      />,
    );

    await waitFor(() => expect(screen.getByRole("toolbar")).toBeTruthy());
    expect(screen.getByRole("button", { name: "Bold" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Insert table" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Undo" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Blockquote" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Add or edit link" }));
    expect(onEditLink).toHaveBeenCalledTimes(1);
  });

  it("renders a host-supplied footer", async () => {
    render(
      <RichTextEditor
        defaultValue="<p>Counted</p>"
        footer={({ characters }) => <span>{characters} / 2000</span>}
      />,
    );

    await waitFor(() => expect(screen.getByText("7 / 2000")).toBeTruthy());
    expect(screen.queryByText("1 word")).toBeNull();
  });

  it("writes an outside change back into the document", async () => {
    const ref = createRef<RichTextEditorRef>();
    const { rerender } = render(
      <RichTextEditor ref={ref} value="<p>First</p>" />,
    );

    await waitFor(() => expect(ref.current?.getEditor()).toBeTruthy());

    rerender(<RichTextEditor ref={ref} value="<p>Second</p>" />);
    expect(ref.current!.getEditor()!.getText()).toBe("Second");
  });

  it("leaves the document alone while the caret is in it", async () => {
    const ref = createRef<RichTextEditorRef>();
    const { rerender } = render(
      <RichTextEditor ref={ref} value="<p>First</p>" />,
    );

    await waitFor(() => expect(ref.current?.getEditor()).toBeTruthy());

    // jsdom will not focus a contenteditable element, so the state the guard
    // reads is set here instead.
    const editor = ref.current!.getEditor()!;
    Object.defineProperty(editor, "isFocused", {
      configurable: true,
      get: () => true,
    });

    rerender(<RichTextEditor ref={ref} value="<p>Stale echo</p>" />);
    expect(editor.getText()).toBe("First");
  });

  it("creates and edits tables through Tiptap commands", async () => {
    const ref = createRef<RichTextEditorRef>();
    render(<RichTextEditor ref={ref} />);

    await waitFor(() => expect(ref.current?.getEditor()).toBeTruthy());
    expect(screen.getByRole("button", { name: "Insert table" })).toBeTruthy();

    const editor = ref.current!.getEditor()!;
    act(() => {
      editor.commands.insertTable({ rows: 2, cols: 3, withHeaderRow: true });
    });

    expect(editor.getHTML().match(/<th/g)).toHaveLength(3);
    expect(editor.getHTML().match(/<tr/g)).toHaveLength(2);

    act(() => {
      editor.commands.addRowAfter();
    });
    expect(editor.getHTML().match(/<tr/g)).toHaveLength(3);
  });
});
