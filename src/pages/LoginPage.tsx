import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ApiError } from '../api/errors';
import { useAuth } from '../app/AuthContext';
import { Container } from '../components/layout/Container';
import { Button } from '../components/common/Button';
import { Field } from '../components/common/Field';
import { useT } from '../hooks/useT';
import { useValidatedForm } from '../hooks/useValidatedForm';
import { errorKey } from '../lib/errors';
import { routes } from '../lib/routes';
import { email as emailRule, required } from '../lib/validation';

type Values = { email: string; password: string };

export function LoginPage() {
  const { t } = useT();
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { values, errors, setValue, checkField, checkAll } = useValidatedForm<Values>(
    { email: '', password: '' },
    { email: emailRule, password: required }
  );

  const [failure, setFailure] = useState<unknown>(null);
  const [pending, setPending] = useState(false);

  // Where the guard sent them from; falls back to the library.
  const redirect = searchParams.get('redirect') || routes.library();

  if (user) {
    return <Navigate to={redirect} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!checkAll()) return;

    setFailure(null);
    setPending(true);

    try {
      await signIn(values);
      navigate(redirect, { replace: true });
    } catch (error) {
      setFailure(error);
    } finally {
      setPending(false);
    }
  }

  return (
    <Container className="py-8 sm:py-12">
      <div className="mx-auto max-w-md">
        <h1>{t('auth.login.title')}</h1>
        <p className="mt-3 text-neutral-700">{t('auth.login.subtitle')}</p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-4">
          {/* One message for a wrong email or a wrong password, never which of
              the two — telling them apart reveals whether an account exists.
              It sits above the form rather than on a field for the same
              reason: neither field is the one at fault. */}
          {failure != null && (
            <p
              role="alert"
              className="rounded-sm border border-danger/30 px-3 py-2 text-sm text-danger"
            >
              {failure instanceof ApiError && failure.status === 401
                ? t('auth.login.invalid')
                : t(errorKey(failure))}
            </p>
          )}

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

          <Field
            label={t('auth.password')}
            type="password"
            name="password"
            autoComplete="current-password"
            rule={t('auth.rules.passwordRequired')}
            invalid={Boolean(errors.password)}
            value={values.password}
            onChange={(event) => setValue('password', event.target.value)}
            onBlur={() => checkField('password')}
          />

          <Button type="submit" disabled={pending}>
            {pending ? t('auth.login.pending') : t('auth.login.action')}
          </Button>
        </form>

        <p className="mt-6 text-sm text-neutral-700">
          <Link to={routes.forgotPassword()} className="underline underline-offset-4">
            {t('auth.login.forgot')}
          </Link>
        </p>

        <p className="mt-2 text-sm text-neutral-700">
          {t('auth.login.noAccount')}{' '}
          <Link to={routes.register()} className="underline underline-offset-4">
            {t('auth.login.toRegister')}
          </Link>
        </p>

        {/* TODO: remove once a real backend exists. */}
        {import.meta.env.VITE_USE_MOCKS === 'true' && (
          <p className="mt-8 rounded-sm border border-neutral-900/12 bg-neutral-100 p-3 text-sm text-neutral-700">
            {t('auth.login.demoHint')}
          </p>
        )}
      </div>
    </Container>
  );
}
