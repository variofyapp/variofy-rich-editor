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

  it("renders chart templates as a visual gallery", async () => {
    render(<RichTextEditor tools={["ecommerceChart"]} />);

    await waitFor(() => expect(screen.getByRole("textbox")).toBeTruthy());
    fireEvent.click(
      screen.getByRole("button", { name: "Insert e-commerce chart" }),
    );

    expect(
      screen.getByRole("group", { name: "Chart templates" }),
    ).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Size chart" })).toBeTruthy();
    expect(
      screen.getByRole("menuitem", { name: "Conversion chart" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("menuitem", { name: "Product comparison" }),
    ).toBeTruthy();
    expect(screen.getByText("Apparel sizes and body measurements")).toBeTruthy();
    expect(screen.getByText("US, EU, UK and metric size conversion")).toBeTruthy();
    expect(screen.getByText("Compare products feature by feature")).toBeTruthy();
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

  it("disables chart insertion when table support is disabled", async () => {
    render(<RichTextEditor table={false} tools={["ecommerceChart"]} />);

    await waitFor(() => expect(screen.getByRole("textbox")).toBeTruthy());
    expect(
      screen.getByRole("button", { name: "Insert e-commerce chart" }).hasAttribute("disabled"),
    ).toBe(true);
  });
});
