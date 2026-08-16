import { act, render, screen, waitFor } from "@testing-library/react";
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

  it("hides editing controls in read-only mode", async () => {
    render(<RichTextEditor editable={false} defaultValue="<p>Read only</p>" />);

    await waitFor(() => expect(screen.getByRole("textbox")).toBeTruthy());
    expect(screen.queryByRole("toolbar")).toBeNull();
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
