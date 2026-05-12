import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/common/text";
import { Box } from "@/components/common/box";
import { useTranslation } from "react-i18next";
import { COURT_TYPE_SELECT_OPTIONS } from "@/features/quadras/schemas/quadraSchema";

export interface QuadraFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function QuadraFilter({ value, onValueChange }: QuadraFilterProps) {
  const { t } = useTranslation();

  return (
    <Box className="flex items-center gap-4">
      <Text
        variant="bold"
        tKey="courts:court_type"
        as="span"
        className="text-sm"
      />
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[200px] bg-background border-border rounded-xl h-11">
          <SelectValue placeholder={t("courts:all_types")} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-border">
          <SelectItem value="Todos" className="rounded-lg cursor-pointer">
            {t("courts:all_types")}
          </SelectItem>
          {COURT_TYPE_SELECT_OPTIONS.map((item) => (
            <SelectItem
              value={item?.value}
              className="rounded-lg cursor-pointer"
            >
              {t(item?.label)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Box>
  );
}
