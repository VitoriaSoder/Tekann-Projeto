import React from "react";
import { Text } from "./text";

export default function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden">
      <div className="px-7 py-5 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
          <Icon size={17} className="text-foreground/70" />
        </div>
        <div>
          <Text as="h2" className="text-base font-bold text-foreground">
            {title}
          </Text>
          <Text className="text-xs text-muted-foreground font-medium">
            {description}
          </Text>
        </div>
      </div>
      <div className="px-7 py-6">{children}</div>
    </div>
  );
}
