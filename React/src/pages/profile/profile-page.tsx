import { useState } from "react"
import { User, Lock, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useUpdateProfile, useUpdatePassword, useDeleteAccount } from "@/logic/hooks/profile/use-profile"
import { useAppSelector } from "@/logic/store/hooks"
function SectionCard({ title, description, icon: Icon, children }: { title: string; description: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-[24px] border border-border shadow-sm overflow-hidden">
      <div className="px-7 py-5 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
          <Icon size={17} className="text-foreground/70" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground font-medium">{description}</p>
        </div>
      </div>
      <div className="px-7 py-6">{children}</div>
    </div>
  )
}
function ProfileForm() {
  const { form, isLoading, onSubmit } = useUpdateProfile()
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground font-semibold">Nome Completo</FormLabel>
              <FormControl>
                <Input {...field} className="rounded-xl h-11 bg-muted/30 border-border focus-visible:ring-primary" />
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold disabled:opacity-60"
        >
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </form>
    </Form>
  )
}
function PasswordForm() {
  const { form, isLoading, onSubmit } = useUpdatePassword()
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground font-semibold">Senha Atual</FormLabel>
              <FormControl>
                <Input type="password" {...field} placeholder="••••••••" className="rounded-xl h-11 bg-muted/30 border-border focus-visible:ring-primary" />
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-semibold">Nova Senha</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="••••••••" className="rounded-xl h-11 bg-muted/30 border-border focus-visible:ring-primary" />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-semibold">Confirmar</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="••••••••" className="rounded-xl h-11 bg-muted/30 border-border focus-visible:ring-primary" />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold disabled:opacity-60"
        >
          {isLoading ? "Atualizando..." : "Atualizar Senha"}
        </Button>
      </form>
    </Form>
  )
}
function DeleteAccountSection() {
  const [isOpen, setIsOpen] = useState(false)
  const { isLoading, handleDelete } = useDeleteAccount()
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Esta ação é irreversível. Todos os seus dados serão removidos permanentemente.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="shrink-0 h-11 px-5 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold"
        >
          <Trash2 size={15} className="mr-2" />
          Remover Conta
        </Button>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-[28px] border-border p-0 overflow-hidden gap-0">
          <div className="bg-destructive/10 px-7 py-6 border-b border-destructive/20">
            <div className="flex items-center gap-3 mb-1">
              <AlertCircle size={20} className="text-destructive" />
              <DialogTitle className="text-lg font-bold text-foreground">Remover conta</DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground font-medium">
              Tem certeza que deseja remover sua conta permanentemente?
            </DialogDescription>
          </div>
          <DialogFooter className="px-7 py-5 flex gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1 rounded-xl h-11">
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isLoading}
              className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold border-0"
            >
              {isLoading ? "Removendo..." : "Sim, remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
export default function ProfilePage() {
  const user = useAppSelector(s => s.auth.user)
  return (
    <div className="p-4 md:p-8 max-w-[720px] mx-auto w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-3xl font-extrabold tracking-tight text-foreground">Meu Perfil</h1>
        <p className="text-muted-foreground font-medium mt-1 text-sm md:text-base">{user?.email}</p>
      </div>
      <div className="space-y-5">
        <SectionCard title="Informações Pessoais" description="Atualize seu nome de exibição" icon={User}>
          <ProfileForm />
        </SectionCard>
        <SectionCard title="Segurança" description="Altere sua senha de acesso" icon={Lock}>
          <PasswordForm />
        </SectionCard>
        <SectionCard title="Zona de Perigo" description="Ações irreversíveis na conta" icon={Trash2}>
          <DeleteAccountSection />
        </SectionCard>
      </div>
    </div>
  )
}
