import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { JSONContent } from "@tiptap/core";
import type { Editor } from "@tiptap/react";
import {
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  CircleDot,
  Footprints,
  Ruler,
  Scale,
  Shirt,
  TableProperties,
  type LucideIcon,
} from "lucide-react";

import { Button } from "./ui/button";
import { Tooltip } from "./ui/tooltip";

export interface EcommerceChartMenuProps {
  editor: Editor;
}

interface EcommerceChartTemplate {
  label: string;
  description: string;
  icon: LucideIcon;
  rows: string[][];
}

const templates: EcommerceChartTemplate[] = [
  {
    label: "Size chart",
    description: "Apparel sizes and body measurements",
    icon: Ruler,
    rows: [
      ["Size", "Chest", "Waist", "Hip"],
      ["S", "", "", ""],
      ["M", "", "", ""],
      ["L", "", "", ""],
      ["XL", "", "", ""],
    ],
  },
  {
    label: "Conversion chart",
    description: "US, EU, UK and metric size conversion",
    icon: Scale,
    rows: [
      ["US", "EU", "UK", "CM"],
      ["6", "36", "3", "23"],
      ["7", "37", "4", "23.5"],
      ["8", "38", "5", "24"],
      ["9", "39", "6", "25"],
      ["10", "40", "7", "25.5"],
    ],
  },
  {
    label: "Product comparison",
    description: "Compare products feature by feature",
    icon: TableProperties,
    rows: [
      ["Feature", "Basic", "Pro", "Plus"],
      ["Material", "Cotton", "Linen", "Blend"],
      ["Fit", "Regular", "Slim", "Relaxed"],
      ["Colors", "4", "6", "8"],
      ["Warranty", "1 yr", "2 yr", "2 yr"],
    ],
  },
  {
    label: "Shoe size",
    description: "Foot length with US, EU and UK shoe sizes",
    icon: Footprints,
    rows: [
      ["Foot length", "US", "EU", "UK"],
      ["23 cm", "6", "36", "3.5"],
      ["24 cm", "7.5", "38", "5"],
      ["25 cm", "9", "40", "6.5"],
      ["26 cm", "10", "41", "7.5"],
    ],
  },
  {
    label: "Ring size",
    description: "Inside diameter and circumference conversion",
    icon: CircleDot,
    rows: [
      ["US", "Diameter", "Circumference", "EU"],
      ["5", "15.7 mm", "49.3 mm", "49"],
      ["6", "16.5 mm", "51.9 mm", "52"],
      ["7", "17.3 mm", "54.4 mm", "54"],
      ["8", "18.1 mm", "57.0 mm", "57"],
    ],
  },
  {
    label: "Bra size",
    description: "Band, bust and cup size reference",
    icon: Shirt,
    rows: [
      ["Band", "Bust", "US", "EU"],
      ["32", "33–34 in", "32A", "70A"],
      ["32", "34–35 in", "32B", "70B"],
      ["34", "36–37 in", "34B", "75B"],
      ["36", "39–40 in", "36C", "80C"],
    ],
  },
  {
    label: "International clothing conversion",
    description: "Women's clothing sizes across major regions",
    icon: Scale,
    rows: [
      ["Intl", "US", "EU", "UK"],
      ["XS", "0–2", "32–34", "4–6"],
      ["S", "4–6", "36–38", "8–10"],
      ["M", "8–10", "40–42", "12–14"],
      ["L", "12–14", "44–46", "16–18"],
      ["XL", "16–18", "48–50", "20–22"],
    ],
  },
  {
    label: "Measurement guide",
    description: "Explain where and how customers should measure",
    icon: Ruler,
    rows: [
      ["Body area", "How to measure", "Value"],
      ["Chest", "Measure around the fullest part", ""],
      ["Waist", "Measure around the natural waistline", ""],
      ["Hip", "Measure around the fullest part of the hips", ""],
      ["Inseam", "Measure from crotch to ankle", ""],
    ],
  },
];

function paragraph(text: string): JSONContent {
  return text
    ? { type: "paragraph", content: [{ type: "text", text }] }
    : { type: "paragraph" };
}

function tableFromRows(rows: string[][]): JSONContent {
  return {
    type: "table",
    content: rows.map((row, rowIndex) => ({
      type: "tableRow",
      content: row.map((value) => ({
        type: rowIndex === 0 ? "tableHeader" : "tableCell",
        content: [paragraph(value)],
      })),
    })),
  };
}

function insertTemplate(editor: Editor, template: EcommerceChartTemplate) {
  editor.chain().focus().insertContent(tableFromRows(template.rows)).run();
}

function ChartPreview({ rows }: { rows: string[][] }) {
  const visibleRows = rows.slice(0, 4);
  const columns = Math.min(rows[0]?.length ?? 1, 4);

  return (
    <div
      className="ve-commerce-gallery__preview"
      aria-hidden="true"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {visibleRows.flatMap((row, rowIndex) =>
        row.slice(0, columns).map((value, columnIndex) => (
          <span
            key={`${rowIndex}-${columnIndex}`}
            className={
              rowIndex === 0
                ? "ve-commerce-gallery__cell ve-commerce-gallery__cell--header"
                : "ve-commerce-gallery__cell"
            }
          >
            {value || "—"}
          </span>
        )),
      )}
    </div>
  );
}

export function EcommerceChartMenu({ editor }: EcommerceChartMenuProps) {
  const disabled = !editor.schema.nodes.table || editor.isActive("table");

  return (
    <DropdownMenu.Root>
      <Tooltip
        content={
          disabled
            ? "E-commerce charts need table support and must be inserted outside a table"
            : "Insert e-commerce chart"
        }
      >
        <DropdownMenu.Trigger asChild disabled={disabled}>
          <Button
            variant="ghost"
            size="sm"
            className="ve-table-trigger"
            aria-label="Insert e-commerce chart"
            disabled={disabled}
          >
            <ChartNoAxesColumnIncreasing size={17} />
            <ChevronDown size={13} className="ve-table-trigger__chevron" />
          </Button>
        </DropdownMenu.Trigger>
      </Tooltip>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="ve-dropdown ve-dropdown--commerce-gallery"
        >
          <div className="ve-commerce-gallery__header">
            <strong>E-commerce charts</strong>
            <span>Choose a ready-to-edit table template</span>
          </div>

          <div className="ve-commerce-gallery" role="group" aria-label="Chart templates">
            {templates.map((template) => {
              const Icon = template.icon;
              return (
                <DropdownMenu.Item
                  key={template.label}
                  className="ve-commerce-gallery__card"
                  aria-label={template.label}
                  onSelect={() => insertTemplate(editor, template)}
                >
                  <ChartPreview rows={template.rows} />
                  <span className="ve-commerce-gallery__meta">
                    <span className="ve-commerce-gallery__title">
                      <Icon size={16} />
                      <strong>{template.label}</strong>
                    </span>
                    <small>{template.description}</small>
                  </span>
                </DropdownMenu.Item>
              );
            })}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
