import type { ComponentType, MouseEvent } from "react";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Tooltip } from "./ui/tooltip";

interface ToolbarButtonProps {
  label: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function ToolbarButton({
  label,
  icon: Icon,
  active = false,
  disabled = false,
  onClick,
}: ToolbarButtonProps) {
  const keepEditorFocused = (event: MouseEvent<HTMLButtonElement>) => {
    // A toolbar button would normally take DOM focus on mousedown. ProseMirror
    // keeps its logical selection, so formatting still works, but the browser
    // stops painting the native text-selection highlight. Preventing the focus
    // transfer keeps both the visual selection and the editor selection intact.
    event.preventDefault();
  };

  return (
    <Tooltip content={label}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={label}
        aria-pressed={active}
        disabled={disabled}
        className={cn(active && "ve-button--active")}
        onMouseDown={keepEditorFocused}
        onClick={onClick}
      >
        <Icon size={17} strokeWidth={2} />
      </Button>
    </Tooltip>
  );
}
