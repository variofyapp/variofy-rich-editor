import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { JSONContent } from "@tiptap/core";
import type { Editor } from "@tiptap/react";
import {
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  Ruler,
  Scale,
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
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ],
  },
  {
    label: "Product comparison",
    description: "Compare products feature by feature",
    icon: TableProperties,
    rows: [
      ["Feature", "Product A", "Product B", "Product C"],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
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

export function EcommerceChartMenu({ editor }: EcommerceChartMenuProps) {
  const disabled = editor.isActive("table");

  return (
    <DropdownMenu.Root>
      <Tooltip
        content={disabled ? "Move outside the current table first" : "Insert e-commerce chart"}
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
          className="ve-dropdown ve-dropdown--commerce-chart"
        >
          <DropdownMenu.Label className="ve-dropdown__label">
            E-commerce charts
          </DropdownMenu.Label>
          {templates.map(({ label, description, icon: Icon, ...template }) => (
            <DropdownMenu.Item
              key={label}
              className="ve-dropdown__item ve-commerce-chart__item"
              onSelect={() => insertTemplate(editor, { label, description, icon: Icon, ...template })}
            >
              <Icon size={17} />
              <span className="ve-commerce-chart__copy">
                <strong>{label}</strong>
                <small>{description}</small>
              </span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
