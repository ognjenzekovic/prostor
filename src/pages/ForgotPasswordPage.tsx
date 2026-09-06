import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../api/auth';
import { Container } from '../components/layout/Container';
import { Button } from '../components/common/Button';
import { Field } from '../components/common/Field';
import { useT } from '../hooks/useT';
import { useValidatedForm } from '../hooks/useValidatedForm';
import { routes } from '../lib/routes';
import { email as emailRule } from '../lib/validation';

type Values = { email: string };

export function ForgotPasswordPage() {
  const { t } = useT();
  const { values, errors, setValue, checkField, checkAll } = useValidatedForm<Values>(
    { email: '' },
    { email: emailRule }
  );

  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!checkAll()) return;

    setPending(true);
    // The endpoint answers 204 whether or not the address has an account, so
    // this screen must not branch on the result either: a different message
    // for a missing account would let anyone test which addresses exist.
    await requestPasswordReset(values.email.trim()).catch(() => undefined);
    setPending(false);
    setSent(true);
  }

  return (
    <Container className="py-8 sm:py-12">
      <div className="mx-auto max-w-md">
        <h1>{t('auth.forgot.title')}</h1>

        {sent ? (
          <>
            <p className="mt-4 text-neutral-700">
              {t('auth.forgot.sent', { email: values.email.trim() })}
            </p>
            <p className="mt-6 text-sm text-neutral-700">
              <Link to={routes.login()} className="underline underline-offset-4">
                {t('auth.forgot.backToLogin')}
              </Link>
            </p>
          </>
        ) : (
          <>
            <p className="mt-3 text-neutral-700">{t('auth.forgot.subtitle')}</p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-4">
              <Field
                label={t('auth.email')}
                type="email"
                name="email"
                autoComplete="email"
                rule={t('auth.rules.email')}
                invalid={Boolean(errors.email)}
                value={values.email}
                onChange={(event) => setValue('email', event.target.value)}
                onBlur={() => checkField('email')}
              />

              <Button type="submit" disabled={pending}>
                {pending ? t('auth.forgot.pending') : t('auth.forgot.action')}
              </Button>
            </form>
          </>
        )}
      </div>
    </Container>
  );
}
