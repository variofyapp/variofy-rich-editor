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

  it("renders all chart templates as a visual gallery", async () => {
    render(<RichTextEditor tools={["ecommerceChart"]} />);

    await waitFor(() => expect(screen.getByRole("textbox")).toBeTruthy());
    fireEvent.click(
      screen.getByRole("button", { name: "Insert e-commerce chart" }),
    );

    expect(
      screen.getByRole("group", { name: "Chart templates" }),
    ).toBeTruthy();

    for (const name of [
      "Size chart",
      "Conversion chart",
      "Product comparison",
      "Shoe size",
      "Ring size",
      "Bra size",
      "International clothing conversion",
      "Measurement guide",
    ]) {
      expect(screen.getByRole("menuitem", { name })).toBeTruthy();
    }

    expect(screen.getByText("Foot length with US, EU and UK shoe sizes")).toBeTruthy();
    expect(screen.getByText("Inside diameter and circumference conversion")).toBeTruthy();
    expect(screen.getByText("Band, bust and cup size reference")).toBeTruthy();
    expect(screen.getByText("Women's clothing sizes across major regions")).toBeTruthy();
    expect(screen.getByText("Explain where and how customers should measure")).toBeTruthy();
  });

  it("inserts the sample data shown by the conversion preview", async () => {
    const ref = createRef<RichTextEditorRef>();
    render(<RichTextEditor ref={ref} tools={["ecommerceChart"]} />);

    await waitFor(() => expect(ref.current?.getEditor()).toBeTruthy());
    fireEvent.click(
      screen.getByRole("button", { name: "Insert e-commerce chart" }),
    );
    fireEvent.click(screen.getByRole("menuitem", { name: "Conversion chart" }));

    const html = ref.current!.getEditor()!.getHTML();
    expect(html).toContain("23.5");
    expect(html).toContain("25.5");
    expect(html).toContain("EU");
  });

  it("inserts the measurement guide template", async () => {
    const ref = createRef<RichTextEditorRef>();
    render(<RichTextEditor ref={ref} tools={["ecommerceChart"]} />);

    await waitFor(() => expect(ref.current?.getEditor()).toBeTruthy());
    fireEvent.click(
      screen.getByRole("button", { name: "Insert e-commerce chart" }),
    );
    fireEvent.click(screen.getByRole("menuitem", { name: "Measurement guide" }));

    const html = ref.current!.getEditor()!.getHTML();
    expect(html).toContain("Body area");
    expect(html).toContain("natural waistline");
    expect(html).toContain("Inseam");
  });

  it("disables chart insertion when table support is disabled", async () => {
    render(<RichTextEditor table={false} tools={["ecommerceChart"]} />);

    await waitFor(() => expect(screen.getByRole("textbox")).toBeTruthy());
    expect(
      screen.getByRole("button", { name: "Insert e-commerce chart" }).hasAttribute("disabled"),
    ).toBe(true);
  });
});
