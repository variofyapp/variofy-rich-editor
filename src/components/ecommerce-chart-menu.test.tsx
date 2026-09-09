import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createRef } from "react";

import {
  RichTextEditor,
  type RichTextEditorRef,
} from "./rich-text-editor";

describe("EcommerceChartMenu", () => {
  it("inserts an editable size chart through the built-in toolbar", async () => {
    const ref = createRef<RichTextEditorRef>();
    render(<RichTextEditor ref={ref} tools={["ecommerceChart"]} />);

    await waitFor(() => expect(ref.current?.getEditor()).toBeTruthy());

    fireEvent.click(
      screen.getByRole("button", { name: "Insert e-commerce chart" }),
    );
    fireEvent.click(screen.getByRole("menuitem", { name: "Size chart" }));

    const html = ref.current!.getEditor()!.getHTML();
    expect(html.match(/<th/g)).toHaveLength(4);
    expect(html.match(/<tr/g)).toHaveLength(5);
    expect(html).toContain("Size");
    expect(html).toContain("Chest");
    expect(html).toContain("XL");
  });

  it("offers conversion and product comparison templates", async () => {
    render(<RichTextEditor tools={["ecommerceChart"]} />);

    await waitFor(() => expect(screen.getByRole("textbox")).toBeTruthy());
    fireEvent.click(
      screen.getByRole("button", { name: "Insert e-commerce chart" }),
    );

    expect(screen.getByRole("menuitem", { name: "Size chart" })).toBeTruthy();
    expect(
      screen.getByRole("menuitem", { name: "Conversion chart" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("menuitem", { name: "Product comparison" }),
    ).toBeTruthy();
  });

  it("disables chart insertion when table support is disabled", async () => {
    render(<RichTextEditor table={false} tools={["ecommerceChart"]} />);

    await waitFor(() => expect(screen.getByRole("textbox")).toBeTruthy());
    expect(
      screen.getByRole("button", { name: "Insert e-commerce chart" }).hasAttribute("disabled"),
    ).toBe(true);
  });
});
