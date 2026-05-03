import { useState } from 'react';
import type { KcContext } from 'keycloakify/login/KcContext';
import { useI18n } from './i18n';
import './styles.css';

export type { KcContext };

type Props = {
  kcContext: KcContext;
};

export function KcPage({ kcContext }: Props) {
  switch (kcContext.pageId) {
    case 'login.ftl':
      return <LoginPage kcContext={kcContext} />;
    case 'register.ftl':
      return <RegisterPage kcContext={kcContext} />;
    case 'login-reset-password.ftl':
      return <ResetPasswordPage kcContext={kcContext} />;
    case 'login-update-password.ftl':
      return <UpdatePasswordPage kcContext={kcContext} />;
    case 'login-verify-email.ftl':
      return <VerifyEmailPage kcContext={kcContext} />;
    case 'error.ftl':
      return <ErrorPage kcContext={kcContext} />;
    default:
      return <DefaultPage kcContext={kcContext} />;
  }
}

function LanguageSwitch({ locale }: { locale: KcContext['locale'] }) {
  const en = locale?.supported?.find(l => l.languageTag.startsWith('en'));
  const pl = locale?.supported?.find(l => l.languageTag.startsWith('pl'));
  const current = locale?.currentLanguageTag;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
      <button
        style={{
          fontWeight: current === 'en' ? 'bold' : 'normal',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          color: 'var(--text)',
        }}
        onClick={() => {
          if (en) window.location.href = en.url;
        }}
        disabled={current === 'en'}
      >
        EN
      </button>
      <button
        style={{
          fontWeight: current === 'pl' ? 'bold' : 'normal',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          color: 'var(--text)',
        }}
        onClick={() => {
          if (pl) window.location.href = pl.url;
        }}
        disabled={current === 'pl'}
      >
        PL
      </button>
    </div>
  );
}

function LoginPage({ kcContext }: { kcContext: KcContext & { pageId: 'login.ftl' } }) {
  const { url, realm, social, message, locale } = kcContext;
  const { i18n } = useI18n({ kcContext });
  const { msgStr } = i18n;

  return (
    <div className="page">
      <div className="card">
        <LanguageSwitch locale={locale} />
        <h1 className="title">{msgStr('loginTitle')}</h1>
        {message && message.type === 'error' && <div className="error">{message.summary}</div>}

        <form
          action={url.loginAction}
          method="post"
        >
          <div className="field">
            <label>{msgStr('email')}</label>
            <input
              type="text"
              name="username"
              autoComplete="username"
              required
            />
          </div>

          <div className="field">
            <div className="password-row">
              <label>{msgStr('password')}</label>
              {realm.resetPasswordAllowed && (
                <a
                  className="forgot"
                  href={url.loginResetCredentialsUrl}
                >
                  {msgStr('forgotPassword')}
                </a>
              )}
            </div>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="login-actions">
            <button
              type="submit"
              className="btn primary"
            >
              {msgStr('loginTitle')}
            </button>
          </div>
        </form>

        <div className="login-secondary">
          {social?.providers?.map(provider => (
            <a
              key={provider.providerId}
              className="btn outline"
              href={provider.loginUrl}
            >
              {msgStr('continueWith', provider.displayName)}
            </a>
          ))}

          {realm.registrationAllowed && (
            <a
              className="btn outline signup"
              href={url.registrationUrl}
            >
              {msgStr('signUp')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function PasswordRequirement({ met, label }: { met: boolean; label: string }) {
  return (
    <div className={`password-req ${met ? 'met' : ''}`}>
      <span className="password-req-icon">{met ? '✓' : '✗'}</span>
      {label}
    </div>
  );
}

function RegisterPage({ kcContext }: { kcContext: KcContext & { pageId: 'register.ftl' } }) {
  const { url, message, profile, messagesPerField, locale } = kcContext as any;
  const { i18n } = useI18n({ kcContext });
  const { msgStr } = i18n;
  const attrs = profile?.attributesByName ?? {};

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    digit: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    match: password.length > 0 && password === confirmPassword,
  };

  const fieldError = (field: string): string | undefined =>
    messagesPerField?.existsError(field) ? messagesPerField.get(field) : undefined;

  return (
    <div className="page">
      <div className="card">
        <LanguageSwitch locale={locale} />
        <h1 className="title">{msgStr('createAccount')}</h1>

        {message && message.type === 'error' && !messagesPerField?.existsError('general') && (
          <div className="error">{message.summary}</div>
        )}

        <form
          action={url.registrationAction}
          method="post"
        >
          <div className="field">
            <label>{msgStr('firstName')}</label>
            <input
              type="text"
              name="firstName"
              defaultValue={attrs.firstName?.value ?? ''}
              required
            />
            {fieldError('firstName') && (
              <div className="field-error">{fieldError('firstName')}</div>
            )}
          </div>

          <div className="field">
            <label>{msgStr('lastName')}</label>
            <input
              type="text"
              name="lastName"
              defaultValue={attrs.lastName?.value ?? ''}
              required
            />
            {fieldError('lastName') && <div className="field-error">{fieldError('lastName')}</div>}
          </div>

          <div className="field">
            <label>{msgStr('email')}</label>
            <input
              type="email"
              name="email"
              defaultValue={attrs.email?.value ?? ''}
              required
            />
            {fieldError('email') && <div className="field-error">{fieldError('email')}</div>}
          </div>

          <div className="field">
            <label>{msgStr('password')}</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            {fieldError('password') && <div className="field-error">{fieldError('password')}</div>}
            {password.length > 0 && (
              <div className="password-requirements">
                <PasswordRequirement
                  met={checks.length}
                  label={msgStr('reqLength')}
                />
                <PasswordRequirement
                  met={checks.upper}
                  label={msgStr('reqUpper')}
                />
                <PasswordRequirement
                  met={checks.digit}
                  label={msgStr('reqDigit')}
                />
                <PasswordRequirement
                  met={checks.special}
                  label={msgStr('reqSpecial')}
                />
              </div>
            )}
          </div>

          <div className="field">
            <label>{msgStr('confirmPassword')}</label>
            <input
              type="password"
              name="password-confirm"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            {confirmPassword.length > 0 && (
              <div className="password-requirements">
                <PasswordRequirement
                  met={checks.match}
                  label={msgStr('reqMatch')}
                />
              </div>
            )}
            {fieldError('password-confirm') && (
              <div className="field-error">{fieldError('password-confirm')}</div>
            )}
          </div>

          <div className="login-actions">
            <button
              type="submit"
              className="btn primary"
            >
              {msgStr('signUp')}
            </button>
          </div>
        </form>

        <a
          className="back-link"
          href={url.loginUrl}
        >
          {msgStr('backToLogin')}
        </a>
      </div>
    </div>
  );
}

function ResetPasswordPage({
  kcContext,
}: {
  kcContext: KcContext & { pageId: 'login-reset-password.ftl' };
}) {
  const { url, message, locale } = kcContext;
  const { i18n } = useI18n({ kcContext });
  const { msgStr } = i18n;

  return (
    <div className="page">
      <div className="card">
        <LanguageSwitch locale={locale} />
        <h1 className="title">{msgStr('resetPassword')}</h1>

        {message && message.type === 'error' && <div className="error">{message.summary}</div>}

        <form
          action={url.loginAction}
          method="post"
        >
          <div className="field">
            <label>{msgStr('email')}</label>
            <input
              type="email"
              name="username"
              placeholder="m@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="login-actions">
            <button
              type="submit"
              className="btn primary"
            >
              {msgStr('sendResetLink')}
            </button>
          </div>
        </form>

        <a
          className="back-link"
          href={url.loginUrl}
        >
          {msgStr('backToLogin')}
        </a>
      </div>
    </div>
  );
}

function UpdatePasswordPage({
  kcContext,
}: {
  kcContext: KcContext & { pageId: 'login-update-password.ftl' };
}) {
  const { url, message, locale } = kcContext;
  const { i18n } = useI18n({ kcContext });
  const { msgStr } = i18n;

  return (
    <div className="page">
      <div className="card">
        <LanguageSwitch locale={locale} />
        <h1 className="title">{msgStr('newPassword')}</h1>

        {message && message.type === 'error' && <div className="error">{message.summary}</div>}

        <form
          action={url.loginAction}
          method="post"
        >
          <div className="field">
            <label>{msgStr('newPassword')}</label>
            <input
              type="password"
              name="password-new"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="field">
            <label>{msgStr('confirmPassword')}</label>
            <input
              type="password"
              name="password-confirm"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="login-actions">
            <button
              type="submit"
              className="btn primary"
            >
              {msgStr('updatePassword')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VerifyEmailPage({
  kcContext,
}: {
  kcContext: KcContext & { pageId: 'login-verify-email.ftl' };
}) {
  const { url, message, locale } = kcContext;
  const { i18n } = useI18n({ kcContext });
  const { msgStr } = i18n;

  return (
    <div className="page">
      <div className="card">
        <LanguageSwitch locale={locale} />
        <h1 className="title">{msgStr('verifyEmail')}</h1>

        {message && (
          <div className={message.type === 'error' ? 'error' : 'error'}>{message.summary}</div>
        )}

        <p style={{ color: 'var(--text)', textAlign: 'center', marginBottom: '24px' }}>
          {msgStr('verifyEmailDesc')}
        </p>

        <a
          className="btn primary"
          style={{ display: 'block', textAlign: 'center' }}
          href={url.loginAction}
        >
          {msgStr('resendEmail')}
        </a>

        <a
          className="back-link"
          href={url.loginUrl}
        >
          {msgStr('backToLogin')}
        </a>
      </div>
    </div>
  );
}

function ErrorPage({ kcContext }: { kcContext: KcContext & { pageId: 'error.ftl' } }) {
  const { message, locale } = kcContext;
  const { i18n } = useI18n({ kcContext });
  const { msgStr } = i18n;

  return (
    <div className="page">
      <div className="card">
        <LanguageSwitch locale={locale} />
        <h1 className="title">{msgStr('errorTitle')}</h1>
        {message && <div className="error">{message.summary}</div>}
      </div>
    </div>
  );
}

function DefaultPage({ kcContext }: { kcContext: KcContext }) {
  const { locale } = kcContext;

  return (
    <div className="page">
      <div className="card">
        <LanguageSwitch locale={locale} />
        <h1 className="title">JuCanEat</h1>
        <p style={{ color: 'var(--text)', textAlign: 'center' }}>Page: {kcContext.pageId}</p>
      </div>
    </div>
  );
}
