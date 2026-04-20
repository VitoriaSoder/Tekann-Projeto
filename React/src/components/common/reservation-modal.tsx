import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Clock, AlertCircle } from "lucide-react"
import { format, addYears, startOfMonth } from "date-fns"
import { ptBR, enUS } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { reservationSchema, ReservationFormData } from "@/features/reservations/schemas/reservation-schema"
import { useReservations } from "@/logic/hooks/use-reservations"
import { useAppSelector } from "@/logic/store/hooks"
import { cn } from "@/lib/utils"
import { TimeSlotPicker } from "./time-slot-picker"
import { useTranslation } from "react-i18next"
import { Heading } from "./heading"
import { Text } from "./text"
import { Box } from "./box"

type ReservationModalProps = {
  trigger?: React.ReactNode
  defaultValues?: Partial<ReservationFormData>
  existingId?: string
  onSuccess?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ReservationModal({ 
  trigger, 
  defaultValues, 
  existingId, 
  onSuccess,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: ReservationModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen
  const { t, i18n } = useTranslation()
  const dateLocale = i18n.language === "en" ? enUS : ptBR

  const [apiError, setApiError] = useState<string | null>(null)
  const courts = useAppSelector(s => s.courts.lista.filter(c => c.isActive))
  const { createReservation, editReservation } = useReservations()
  const isEditing = !!existingId

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema) as any,
    defaultValues: {
      clientName: defaultValues?.clientName || "",
      courtId: defaultValues?.courtId || "",
      date: defaultValues?.date || new Date(),
      startTime: defaultValues?.startTime || "",
      endTime: defaultValues?.endTime || "",
      status: defaultValues?.status || "CONFIRMED",
    },
  })

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      form.reset()
      setApiError(null)
    }
  }

  const onSubmit = (values: any) => {
    setApiError(null)
    if (isEditing && existingId) {
      editReservation(existingId, values.status, function (_result: any, error: any) {
        if (error) {
          setApiError(error.msg || t("reservations:edit_error"))
          return
        }
        handleOpenChange(false)
        onSuccess?.()
      })
    } else {
      createReservation(values, function (_result: any, error: any) {
        if (error) {
          setApiError(error.msg || t("reservations:create_error"))
          return
        }
        handleOpenChange(false)
        onSuccess?.()
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ? trigger : (
          <Button className="bg-primary text-black font-black uppercase tracking-tight hover:bg-primary/90 rounded-full shadow-sm hover:scale-[1.02] transition-transform h-11 px-6">
            <Text variant="none" tKey="reservations:new_reservation" as="span" className="text-sm" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-card border border-border rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden p-0 gap-0">
        <Box className="bg-primary/5 px-8 py-6 border-b border-border relative">
          <Box className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
          <DialogTitle className="z-10 relative m-0">
            <Heading level={2} tKey={isEditing ? "reservations:edit_title" : "reservations:form_title"} className="text-2xl font-extrabold text-foreground tracking-tight m-0" />
          </DialogTitle>
          <DialogDescription className="z-10 relative mt-1">
            <Text variant="muted" tKey="reservations:form_description" className="text-sm font-medium" />
          </DialogDescription>
        </Box>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-8 pb-8 pt-6 space-y-5 relative">
            {apiError && (
              <Box className="anim-fade-up bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl p-4 flex items-start gap-3 text-sm font-medium">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-destructive" />
                <Text className="leading-tight text-destructive">{apiError}</Text>
              </Box>
            )}

            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="courtId"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      <Text variant="bold" tKey="reservations:court_label" className="text-foreground text-xs" />
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl h-12 bg-muted/50 border-border focus:ring-primary focus:border-primary">
                          <SelectValue placeholder={t("reservations:court_placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-border shadow-xl">
                        {courts.map(court => (
                          <SelectItem key={court.id} value={court.id} className="font-medium">{court.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      <Text variant="bold" tKey="reservations:client_label" className="text-foreground text-xs" />
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t("reservations:client_placeholder")} 
                        {...field} 
                        className="rounded-xl h-12 bg-muted/50 border-border focus-visible:ring-primary placeholder:text-muted-foreground/50" 
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 flex flex-col">
                    <FormLabel className="mb-1">
                      <Text variant="bold" tKey="reservations:date_label" className="text-foreground text-xs" />
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "rounded-xl h-12 border-border bg-muted/50 pl-3 text-left font-medium hover:bg-muted w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: dateLocale })
                            ) : (
                              <span>{t("reservations:date_placeholder")}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date)
                            form.setValue("startTime", "")
                            form.setValue("endTime", "")
                          }}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          captionLayout="dropdown"
                          startMonth={startOfMonth(new Date())}
                          endMonth={addYears(new Date(), 2)}
                          initialFocus
                          className="rounded-2xl"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-destructive text-xs" />
                  </FormItem>
                )}
              />

              <Box className="md:col-span-2 mt-2">
                <TimeSlotPicker 
                  courtId={form.watch("courtId")}
                  date={form.watch("date")}
                  selectedTime={form.watch("startTime")}
                  onTimeSelect={(start, end) => {
                    form.setValue("startTime", start)
                    form.setValue("endTime", end)
                  }}
                />
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl><Input {...field} /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl><Input {...field} /></FormControl>
                    </FormItem>
                  )}
                />
                {form.formState.errors.startTime && (
                  <Text className="text-destructive text-xs mt-2 font-medium" tKey="reservations:select_time_error" />
                )}
              </Box>
            </Box>

            <DialogFooter className="pt-8 border-t border-border flex sm:justify-between items-center sm:space-x-3 w-full mt-8">
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)} className="rounded-full font-medium text-muted-foreground hover:text-foreground w-full sm:w-auto">
                <Text variant="bold" tKey="common:cancel" as="span" className="text-sm" />
              </Button>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting} 
                className="rounded-full w-full sm:w-auto h-11 px-8 font-black uppercase tracking-tight bg-primary text-black hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-md disabled:opacity-70 disabled:hover:scale-100"
              >
                {form.formState.isSubmitting ? (
                  <Text variant="none" tKey="common:saving" as="span" className="text-sm" />
                ) : (
                  <Text variant="none" tKey="common:save" as="span" className="text-sm" />
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

