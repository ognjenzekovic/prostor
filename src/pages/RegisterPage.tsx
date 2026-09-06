import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/errors';
import { useAuth } from '../app/AuthContext';
import { useScript } from '../app/ScriptContext';
import { Container } from '../components/layout/Container';
import { Button } from '../components/common/Button';
import { Checkbox, Field } from '../components/common/Field';
import { useT } from '../hooks/useT';
import { useValidatedForm } from '../hooks/useValidatedForm';
import { errorKey } from '../lib/errors';
import { routes } from '../lib/routes';
import {
  MIN_NAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  checked,
  email as emailRule,
  password as passwordRule,
  personName,
  serverFieldErrors,
} from '../lib/validation';

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  acceptTerms: boolean;
};

export function RegisterPage() {
  const { t } = useT();
  const { user, signUp } = useAuth();
  const { script } = useScript();
  const navigate = useNavigate();

  const { values, errors, setValue, checkField, checkAll } = useValidatedForm<Values>(
    { firstName: '', lastName: '', email: '', password: '', acceptTerms: false },
    {
      firstName: personName,
      lastName: personName,
      email: emailRule,
      password: passwordRule,
      acceptTerms: checked,
    }
  );

  const [failure, setFailure] = useState<unknown>(null);
  const [serverError, setServerError] = useState<Partial<Record<keyof Values, string>>>({});
  const [pending, setPending] = useState(false);

  if (user) {
    return <Navigate to={routes.library()} replace />;
  }

  /**
   * The server complained about the value that was in the box; editing it
   * makes the complaint stale, so it goes as soon as the field is touched.
   * Rule messages clear themselves inside useValidatedForm.
   */
  function change<K extends keyof Values>(key: K, value: Values[K]) {
    setValue(key, value);
    setServerError((previous) => (previous[key] ? { ...previous, [key]: undefined } : previous));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setServerError({});
    if (!checkAll()) return;

    setFailure(null);
    setPending(true);

    try {
      await signUp({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        password: values.password,
        acceptTerms: values.acceptTerms,
        // The reader already chose a script before signing up; carry it over
        // instead of asking again.
        script: script === 'cyrillic' ? 'cyr' : 'lat',
      });
      navigate(routes.library(), { replace: true });
    } catch (error) {
      // A taken address belongs on the email field, not in a banner. It is a
      // server error rather than a rule, so it replaces the requirement text.
      if (error instanceof ApiError && error.status === 409) {
        setServerError({ email: t('errors.EMAIL_TAKEN') });
      } else if (error instanceof ApiError && error.errors?.length) {
        setServerError(serverFieldErrors<Values>(error.errors));
      } else {
        setFailure(error);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <Container className="py-8 sm:py-12">
      <div className="mx-auto max-w-md">
        <h1>{t('auth.register.title')}</h1>
        <p className="mt-3 text-neutral-700">{t('auth.register.subtitle')}</p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-4">
          {failure != null && (
            <p
              role="alert"
              className="rounded-sm border border-danger/30 px-3 py-2 text-sm text-danger"
            >
              {t(errorKey(failure))}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label={t('auth.firstName')}
              name="firstName"
              autoComplete="given-name"
              rule={t('auth.rules.name', { count: MIN_NAME_LENGTH })}
              invalid={Boolean(errors.firstName)}
              error={serverError.firstName}
              value={values.firstName}
              onChange={(event) => change('firstName', event.target.value)}
              onBlur={() => checkField('firstName')}
            />

            <Field
              label={t('auth.lastName')}
              name="lastName"
              autoComplete="family-name"
              rule={t('auth.rules.name', { count: MIN_NAME_LENGTH })}
              invalid={Boolean(errors.lastName)}
              error={serverError.lastName}
              value={values.lastName}
              onChange={(event) => change('lastName', event.target.value)}
              onBlur={() => checkField('lastName')}
            />
          </div>

          <Field
            label={t('auth.email')}
            type="email"
            name="email"
            autoComplete="email"
            rule={t('auth.rules.email')}
            invalid={Boolean(errors.email)}
            error={serverError.email}
            value={values.email}
            onChange={(event) => change('email', event.target.value)}
            onBlur={() => checkField('email')}
          />

          <Field
            label={t('auth.password')}
            type="password"
            name="password"
            autoComplete="new-password"
            rule={t('auth.rules.password', { count: MIN_PASSWORD_LENGTH })}
            invalid={Boolean(errors.password)}
            error={serverError.password}
            value={values.password}
            onChange={(event) => change('password', event.target.value)}
            onBlur={() => checkField('password')}
          />

          <Checkbox
            name="acceptTerms"
            checked={values.acceptTerms}
            onChange={(event) => change('acceptTerms', event.target.checked)}
            error={errors.acceptTerms && t(errors.acceptTerms)}
            label={
              <>
                {t('auth.register.acceptPrefix')}{' '}
                <Link to={routes.termsOfService()} className="underline underline-offset-4">
                  {t('footer.terms')}
                </Link>{' '}
                {t('auth.register.acceptAnd')}{' '}
                <Link to={routes.privacyPolicy()} className="underline underline-offset-4">
                  {t('footer.privacy')}
                </Link>
                .
              </>
            }
          />

          <Button type="submit" disabled={pending}>
            {pending ? t('auth.register.pending') : t('auth.register.action')}
          </Button>
        </form>

        <p className="mt-6 text-sm text-neutral-700">
          {t('auth.register.haveAccount')}{' '}
          <Link to={routes.login()} className="underline underline-offset-4">
            {t('auth.register.toLogin')}
          </Link>
        </p>
      </div>
    </Container>
  );
}
