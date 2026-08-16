import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { Editor } from "@tiptap/react";
import {
  BetweenHorizontalEnd,
  BetweenHorizontalStart,
  BetweenVerticalEnd,
  BetweenVerticalStart,
  ChevronDown,
  Columns3,
  PanelTop,
  Rows3,
  Table2,
  TableCellsMerge,
  TableCellsSplit,
  Trash2,
} from "lucide-react";
import { useState, type ComponentType } from "react";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Tooltip } from "./ui/tooltip";

export interface TableMenuProps {
  editor: Editor;
}

interface TableMenuItemProps {
  label: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  disabled?: boolean;
  destructive?: boolean;
  onSelect: () => void;
}

function TableMenuItem({
  label,
  icon: Icon,
  disabled,
  destructive,
  onSelect,
}: TableMenuItemProps) {
  return (
    <DropdownMenu.Item
      className={cn(
        "ve-dropdown__item",
        destructive && "ve-dropdown__item--destructive",
      )}
      disabled={disabled}
      onSelect={onSelect}
    >
      <Icon size={16} />
      {label}
    </DropdownMenu.Item>
  );
}

function InsertTableGrid({ editor }: TableMenuProps) {
  const [hovered, setHovered] = useState({ rows: 3, cols: 3 });
  const cells = Array.from({ length: 36 }, (_, index) => ({
    row: Math.floor(index / 6) + 1,
    col: (index % 6) + 1,
  }));

  return (
    <div className="ve-table-picker">
      <div className="ve-table-picker__label">
        Insert table
        <span>{hovered.cols} × {hovered.rows}</span>
      </div>
      <div
        className="ve-table-picker__grid"
        role="grid"
        aria-label="Choose table size"
        onMouseLeave={() => setHovered({ rows: 3, cols: 3 })}
      >
        {cells.map(({ row, col }) => {
          const selected = row <= hovered.rows && col <= hovered.cols;
          return (
            <button
              key={`${row}-${col}`}
              type="button"
              role="gridcell"
              aria-label={`Insert ${col} by ${row} table`}
              className={cn("ve-table-picker__cell", selected && "is-selected")}
              onPointerEnter={() => setHovered({ rows: row, cols: col })}
              onFocus={() => setHovered({ rows: row, cols: col })}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: row, cols: col, withHeaderRow: true })
                  .run()
              }
            />
          );
        })}
      </div>
    </div>
  );
}

export function TableMenu({ editor }: TableMenuProps) {
  const isInTable = editor.isActive("table");

  return (
    <DropdownMenu.Root>
      <Tooltip content={isInTable ? "Edit table" : "Insert table"}>
        <DropdownMenu.Trigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn("ve-table-trigger", isInTable && "ve-button--active")}
            aria-label={isInTable ? "Edit table" : "Insert table"}
          >
            <Table2 size={17} />
            <ChevronDown size={13} className="ve-table-trigger__chevron" />
          </Button>
        </DropdownMenu.Trigger>
      </Tooltip>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className={cn("ve-dropdown", !isInTable && "ve-dropdown--table-picker")}
        >
          {!isInTable ? (
            <InsertTableGrid editor={editor} />
          ) : (
            <>
              <DropdownMenu.Label className="ve-dropdown__label">
                Rows
              </DropdownMenu.Label>
              <TableMenuItem
                label="Add row above"
                icon={BetweenHorizontalStart}
                onSelect={() => editor.chain().focus().addRowBefore().run()}
              />
              <TableMenuItem
                label="Add row below"
                icon={BetweenHorizontalEnd}
                onSelect={() => editor.chain().focus().addRowAfter().run()}
              />
              <TableMenuItem
                label="Delete row"
                icon={Rows3}
                disabled={!editor.can().deleteRow()}
                onSelect={() => editor.chain().focus().deleteRow().run()}
              />

              <DropdownMenu.Separator className="ve-dropdown__separator" />
              <DropdownMenu.Label className="ve-dropdown__label">
                Columns
              </DropdownMenu.Label>
              <TableMenuItem
                label="Add column left"
                icon={BetweenVerticalStart}
                onSelect={() => editor.chain().focus().addColumnBefore().run()}
              />
              <TableMenuItem
                label="Add column right"
                icon={BetweenVerticalEnd}
                onSelect={() => editor.chain().focus().addColumnAfter().run()}
              />
              <TableMenuItem
                label="Delete column"
                icon={Columns3}
                disabled={!editor.can().deleteColumn()}
                onSelect={() => editor.chain().focus().deleteColumn().run()}
              />

              <DropdownMenu.Separator className="ve-dropdown__separator" />
              <DropdownMenu.Label className="ve-dropdown__label">
                Cells
              </DropdownMenu.Label>
              <TableMenuItem
                label="Toggle header row"
                icon={PanelTop}
                onSelect={() => editor.chain().focus().toggleHeaderRow().run()}
              />
              <TableMenuItem
                label="Merge selected cells"
                icon={TableCellsMerge}
                disabled={!editor.can().mergeCells()}
                onSelect={() => editor.chain().focus().mergeCells().run()}
              />
              <TableMenuItem
                label="Split cell"
                icon={TableCellsSplit}
                disabled={!editor.can().splitCell()}
                onSelect={() => editor.chain().focus().splitCell().run()}
              />

              <DropdownMenu.Separator className="ve-dropdown__separator" />
              <TableMenuItem
                label="Delete table"
                icon={Trash2}
                destructive
                onSelect={() => editor.chain().focus().deleteTable().run()}
              />
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

