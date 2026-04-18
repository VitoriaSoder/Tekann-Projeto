import * as React from "react"
import { useTranslation } from "react-i18next"
import { AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heading } from "@/components/common/heading"
import { Text } from "@/components/common/text"
import { Box } from "@/components/common/box"

interface CancelReservationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  clientName: string
}

export function CancelReservationModal({
  isOpen,
  onClose,
  onConfirm,
  clientName,
}: CancelReservationModalProps) {
  const { t } = useTranslation()
  const [reason, setReason] = React.useState("")

  const handleConfirm = () => {
    onConfirm(reason)
    setReason("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border border-border rounded-[32px] p-8">
        <DialogHeader>
          <Box className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </Box>
          <DialogTitle asChild>
            <Heading level={2} tKey="reservations:cancel_booking" className="text-center text-xl font-extrabold m-0" />
          </DialogTitle>
          <DialogDescription asChild>
            <Box className="text-center mt-2">
              <Text variant="muted" tKey="reservations:cancel_confirmation" as="span" />
              <br />
              <Text variant="bold" className="text-foreground mt-1" as="span">{clientName}</Text>
            </Box>
          </DialogDescription>
        </DialogHeader>
        <Box className="py-6">
          <Textarea
            placeholder={t("reservations:reason_placeholder")}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[120px] rounded-2xl bg-muted/30 border-border focus-visible:ring-destructive placeholder:text-muted-foreground/50"
          />
        </Box>
        <DialogFooter className="sm:justify-center gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-full font-bold px-6">
            <Text tKey="common:cancel" as="span" />
          </Button>
          <Button variant="destructive" onClick={handleConfirm} className="rounded-full font-bold px-8 shadow-lg shadow-destructive/20">
            <Text tKey="common:confirm" as="span" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

