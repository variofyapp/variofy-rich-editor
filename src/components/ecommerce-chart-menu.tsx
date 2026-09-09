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
  icon: LucideIcon;
  rows: string[][];
}

const templates: EcommerceChartTemplate[] = [
  {
    label: "Size chart",
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
          className="ve-dropdown"
        >
          <DropdownMenu.Label className="ve-dropdown__label">
            E-commerce charts
          </DropdownMenu.Label>
          {templates.map((template) => {
            const Icon = template.icon;
            return (
              <DropdownMenu.Item
                key={template.label}
                className="ve-dropdown__item"
                onSelect={() => insertTemplate(editor, template)}
              >
                <Icon size={17} />
                {template.label}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
