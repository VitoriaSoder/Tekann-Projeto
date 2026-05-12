import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "../ui/select";
import { Text } from "./text";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectInputTextProps {
  title?: string;
  description?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  showAllOption?: boolean;
  allOptionLabel?: string;
  className?: string;
  triggerClassName?: string;
}

export default function SelectInputText({
  title,
  description,
  value,
  onValueChange,
  options = [],
  placeholder = "Selecione...",
  showAllOption = false,
  allOptionLabel = "Todos",
  className = "flex flex-col gap-1.5",
  triggerClassName = "w-full sm:w-[200px]",
}: SelectInputTextProps) {
  return (
    <div className={className}>
      {(title || description) && (
        <div className="flex flex-col mb-1">
          {title && <Text className="text-sm font-semibold">{title}</Text>}
          {description && <Text className="text-xs text-muted-foreground">{description}</Text>}
        </div>
      )}

      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={`bg-background border-border rounded-xl h-11 ${triggerClassName}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-border">
          {showAllOption && (
            <SelectItem value="todos" className="rounded-lg cursor-pointer">
              {allOptionLabel}
            </SelectItem>
          )}

          {options.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className="rounded-lg cursor-pointer"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
