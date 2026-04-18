import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/common/box';
import { FormField } from '@/components/common/FormField/form-field';
import { useAuthLogin } from '@/logic/hooks/auth/use-auth';
import { Heading } from '@/components/common/heading';
import { Text } from '@/components/common/text';

export default function Login() {
  const { form, onSubmit, isLoading } = useAuthLogin();

  return (
    <Box className="flex flex-col">
      <Box className="mb-10">
        <Heading level={1} tKey="auth:login_title" className="text-3xl font-black tracking-tighter uppercase text-foreground mb-3" />
        <Text variant="muted" tKey="auth:login_welcome" />
      </Box>
      <form className="space-y-5" onSubmit={onSubmit}>
        <FormField
          labelKey="auth:email_label"
          name="email"
          type="email"
          placeholderKey="auth:email_placeholder"
          register={form.register}
          error={form.formState.errors.email?.message}
        />
        <Box className="space-y-1.5">
          <FormField
            labelKey="auth:password_label"
            name="password"
            type="password"
            placeholderKey="auth:password_placeholder"
            register={form.register}
            error={form.formState.errors.password?.message}
          />
        </Box>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 rounded-2xl bg-primary text-black hover:bg-primary/90 text-sm font-black uppercase tracking-widest transition-all mt-8 shadow-xl hover:scale-[1.02] shadow-primary/10 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Text variant="bold" tKey="auth:logging_in" as="span" className="text-sm text-black" />
          ) : (
            <Text variant="bold" tKey="auth:login_button" as="span" className="text-sm text-black" />
          )}
        </Button>
      </form>
      <Box className="mt-10 text-center flex items-center justify-center whitespace-nowrap flex-nowrap overflow-visible">
        <Text variant="muted" as="span" className="inline-flex items-center">
          <Text variant="muted" tKey="auth:no_account" as="span" className="mr-1" />
          <Link to="/auth/register" className="font-bold text-foreground hover:underline transition-all underline-offset-4">
            <Text variant="bold" tKey="auth:register_now" as="span" />
          </Link>
        </Text>
      </Box>

    </Box>
  );
}

