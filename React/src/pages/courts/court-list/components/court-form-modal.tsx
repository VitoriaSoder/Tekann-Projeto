import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { quadraSchema, QuadraFormData } from "@/features/quadras/schemas/quadraSchema"
import { useCourts } from "@/logic/hooks/use-courts"
import { toast } from "sonner"
import { Box } from "@/components/common/box"
import { Heading } from "@/components/common/heading"
import { Text } from "@/components/common/text"
import { useTranslation } from "react-i18next"

export function CourtFormModal() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const { createCourt } = useCourts()
  const form = useForm<QuadraFormData>({
    resolver: zodResolver(quadraSchema) as any,
    defaultValues: {
      name: "",
      type: undefined,
      region: "",
      capacity: 2,
      openingTime: "08:00",
      closingTime: "22:00",
      slotDuration: 60,
    },
  })

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) form.reset()
  }

  const onSubmit = (data: QuadraFormData) => {
    createCourt(data, function (_result, error) {
      if (error) {
        toast.error(error.msg || t("courts:create_error"))
        return
      }
      toast.success(t("courts:create_success"))
      handleOpenChange(false)
    })
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="h-10 px-5 rounded-full bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-tight gap-2 hover:scale-[1.02] transition-transform shadow-md shadow-primary/10"
      >
        <Plus size={16} strokeWidth={3} />
        <Text variant="none" tKey="courts:new_court" as="span" className="text-sm" />
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[540px] bg-card border border-border rounded-[32px] p-0 gap-0 overflow-hidden">
          <Box className="bg-muted/30 px-10 py-8 border-b border-border">
            <DialogTitle asChild>
              <Heading level={2} tKey="courts:form_title" className="text-xl font-extrabold text-foreground tracking-tight m-0" />
            </DialogTitle>
            <DialogDescription asChild>
              <Text variant="muted" tKey="courts:form_description" className="mt-1" />
            </DialogDescription>
          </Box>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-8 py-6 space-y-4">
              <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="font-semibold">
                        <Text variant="bold" tKey="courts:name_label" as="span" className="text-sm" />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("courts:name_placeholder")} className="rounded-xl h-11 bg-background border-border" />
                      </FormControl>
                      <FormMessage className="text-destructive text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        <Text variant="bold" tKey="courts:type_label" as="span" className="text-sm" />
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl h-11 bg-background border-border">
                            <SelectValue placeholder={t("common:select")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="Padel" className="rounded-lg cursor-pointer">Padel</SelectItem>
                          <SelectItem value="Tennis" className="rounded-lg cursor-pointer">Tênis</SelectItem>
                          <SelectItem value="Beach Tennis" className="rounded-lg cursor-pointer">Beach Tennis</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-destructive text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        <Text variant="bold" tKey="courts:region_label" as="span" className="text-sm" />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("courts:region_placeholder")} className="rounded-xl h-11 bg-background border-border" />
                      </FormControl>
                      <FormMessage className="text-destructive text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        <Text variant="bold" tKey="courts:capacity_label" as="span" className="text-sm" />
                      </FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} className="rounded-xl h-11 bg-background border-border" />
                      </FormControl>
                      <FormMessage className="text-destructive text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="openingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        <Text variant="bold" tKey="courts:opening_time" as="span" className="text-sm" />
                      </FormLabel>
                      <FormControl>
                        <Input type="time" {...field} className="rounded-xl h-11 bg-background border-border" />
                      </FormControl>
                      <FormMessage className="text-destructive text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="closingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        <Text variant="bold" tKey="courts:closing_time" as="span" className="text-sm" />
                      </FormLabel>
                      <FormControl>
                        <Input type="time" {...field} className="rounded-xl h-11 bg-background border-border" />
                      </FormControl>
                      <FormMessage className="text-destructive text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slotDuration"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="font-semibold">
                        <Text variant="bold" tKey="courts:slot_duration" as="span" className="text-sm" />
                      </FormLabel>
                      <Select onValueChange={v => field.onChange(Number(v))} defaultValue={String(field.value)}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl h-11 bg-background border-border">
                            <SelectValue placeholder={t("common:select")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="30" className="rounded-lg cursor-pointer">30 {t("common:minutes")}</SelectItem>
                          <SelectItem value="60" className="rounded-lg cursor-pointer">60 {t("common:minutes")}</SelectItem>
                          <SelectItem value="90" className="rounded-lg cursor-pointer">90 {t("common:minutes")}</SelectItem>
                          <SelectItem value="120" className="rounded-lg cursor-pointer">120 {t("common:minutes")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-destructive text-xs" />
                    </FormItem>
                  )}
                />
              </Box>
              <DialogFooter className="pt-4 border-t border-border flex gap-3 mt-4">
                <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)} className="flex-1 rounded-full h-11 font-medium text-muted-foreground">
                  <Text variant="bold" tKey="common:cancel" as="span" className="text-sm" />
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting} className="flex-1 h-11 rounded-full bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-tight disabled:opacity-60 shadow-md shadow-primary/10">
                  {form.formState.isSubmitting ? (
                    <Text variant="none" tKey="courts:creating" as="span" className="text-sm" />
                  ) : (
                    <Text variant="none" tKey="courts:create_button" as="span" className="text-sm" />
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

