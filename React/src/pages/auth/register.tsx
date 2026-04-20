import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/common/box';
import { FormField } from '@/components/common/FormField/form-field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthRegister } from '@/logic/hooks/auth/use-auth';
import { Controller } from 'react-hook-form';
import { Heading } from '@/components/common/heading';
import { Text } from '@/components/common/text';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const { t } = useTranslation();
  const { form, onSubmit, isLoading } = useAuthRegister();

  return (
    <Box className="flex flex-col">
      <Box className="mb-10">
        <Heading level={1} tKey="auth:register_title" className="text-3xl font-black tracking-tighter uppercase text-foreground mb-3" />
        <Text variant="muted" tKey="auth:register_welcome" />
      </Box>
      <form className="space-y-5" onSubmit={onSubmit}>
        <FormField
          labelKey="auth:name_label"
          name="name"
          type="text"
          placeholderKey="auth:name_placeholder"
          register={form.register}
          error={form.formState.errors.name?.message}
        />
        <FormField
          labelKey="auth:email_label"
          name="email"
          type="email"
          placeholderKey="auth:email_placeholder"
          register={form.register}
          error={form.formState.errors.email?.message}
        />
        <Box className="space-y-1.5">
          <Label className="text-sm font-semibold text-foreground block">
            <Text variant="bold" tKey="auth:account_type_label" as="span" className="text-sm" />
          </Label>
          <Controller
            control={form.control}
            name="role"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border focus:ring-primary focus:border-primary font-medium">
                  <SelectValue placeholder={t("common:select")} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border shadow-xl">
                  <SelectItem value="USER" className="font-medium cursor-pointer">
                    <Text variant="inherit" tKey="auth:account_type_user" as="span" />
                  </SelectItem>
                  <SelectItem value="ADMIN" className="font-medium cursor-pointer">
                    <Text variant="inherit" tKey="auth:account_type_admin" as="span" />
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.role && (
            <Text variant="small" className="text-destructive font-bold text-[10px] uppercase tracking-wider">{form.formState.errors.role.message}</Text>
          )}
        </Box>
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField
            labelKey="auth:password_label"
            name="password"
            type="password"
            placeholderKey="auth:password_placeholder"
            register={form.register}
            error={form.formState.errors.password?.message}
          />
          <FormField
            labelKey="auth:confirm_password_label"
            name="confirmPassword"
            type="password"
            placeholderKey="auth:password_placeholder"
            register={form.register}
            error={form.formState.errors.confirmPassword?.message}
          />
        </Box>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 rounded-2xl bg-primary text-black hover:bg-primary/90 text-sm font-black uppercase tracking-widest transition-all mt-8 shadow-xl hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Text variant="none" tKey="auth:creating_account" as="span" className="text-sm font-black text-black" />
          ) : (
            <Text variant="none" tKey="auth:register_button" as="span" className="text-sm font-black text-black" />
          )}
        </Button>
      </form>
      <Box className="mt-10 text-center flex items-center justify-center whitespace-nowrap flex-nowrap overflow-visible">
        <Text variant="muted" as="span" className="inline-flex items-center">
          <Text variant="muted" tKey="auth:have_account" as="span" className="mr-1" />
          <Link to="/auth/login" className="font-bold text-foreground hover:underline transition-all underline-offset-4">
            <Text variant="bold" tKey="auth:login_here" as="span" />
          </Link>
        </Text>
      </Box>

    </Box>
  );
}


