import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

export interface SimpleDialogProps {
  title: string;
  description?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  isLoading?: boolean;
  onConfirm: () => void;
  disabled?: boolean;
  cancelText?: string;
  confirmText?: string;
  variant?: "default" | "destructive";
}

export default function SimpleDialog({
  title,
  description,
  open,
  setOpen,
  isLoading = false,
  onConfirm,
  disabled = false,
  cancelText = "cancel",
  confirmText = "confirm",
  variant = "destructive",
}: SimpleDialogProps) {
  const { t } = useTranslation();

  const isDestructive = variant === "destructive";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[420px] rounded-[28px] border-border p-0 overflow-hidden gap-0">
        <div className={`px-7 py-6 border-b ${isDestructive ? "bg-destructive/10 border-destructive/20" : "bg-muted/30 border-border"}`}>
          <div className="flex items-center gap-3 mb-1">
            <DialogTitle className="text-lg font-bold text-foreground">
              {t(title)}
            </DialogTitle>
          </div>
          {description && (
            <DialogDescription className="text-sm text-muted-foreground font-medium">
              {t(description)}
            </DialogDescription>
          )}
        </div>
        <DialogFooter className="px-7 py-5 flex gap-3 sm:justify-between">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
            className="flex-1 rounded-xl h-11"
          >
            {t(cancelText)}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={disabled || isLoading}
            variant={isDestructive ? "destructive" : "default"}
            className="flex-1 h-11 rounded-xl font-bold border-0"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("loading")}...
              </span>
            ) : (
              t(confirmText)
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
