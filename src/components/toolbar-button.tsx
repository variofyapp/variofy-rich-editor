import type { ComponentType } from "react";

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
  return (
    <Tooltip content={label}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={label}
        aria-pressed={active}
        disabled={disabled}
        className={cn(active && "ve-button--active")}
        onClick={onClick}
      >
        <Icon size={17} strokeWidth={2} />
      </Button>
    </Tooltip>
  );
}

