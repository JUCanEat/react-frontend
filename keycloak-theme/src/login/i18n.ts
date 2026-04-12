import { i18nBuilder } from 'keycloakify/login';
import type { ThemeName } from '../kc.gen';

const { useI18n, ofTypeI18n } = i18nBuilder
  .withThemeName<ThemeName>()
  .withCustomTranslations({
    en: {
      loginTitle: 'Login',
      forgotPassword: 'Forgot your password?',
      continueWith: 'Continue with {0}',
      signUp: 'Sign up',
      createAccount: 'Create Account',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      username: 'Username',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      resetPassword: 'Reset Password',
      sendResetLink: 'Send Reset Link',
      backToLogin: 'Back to Login',
      newPassword: 'New Password',
      updatePassword: 'Update Password',
      verifyEmail: 'Verify Email',
      verifyEmailDesc: 'Check your inbox and click the verification link.',
      resendEmail: 'Resend Email',
      errorTitle: 'Error',
      reqLength: 'At least 8 characters',
      reqUpper: 'At least one uppercase letter',
      reqDigit: 'At least one digit',
      reqSpecial: 'At least one special character',
      reqMatch: 'Passwords match',
    },
    pl: {
      loginTitle: 'Logowanie',
      forgotPassword: 'Zapomniałeś hasła?',
      continueWith: 'Kontynuuj przez {0}',
      signUp: 'Zarejestruj się',
      createAccount: 'Utwórz konto',
      firstName: 'Imię',
      lastName: 'Nazwisko',
      email: 'Email',
      username: 'Nazwa użytkownika',
      password: 'Hasło',
      confirmPassword: 'Potwierdź hasło',
      resetPassword: 'Zresetuj hasło',
      sendResetLink: 'Wyślij link resetujący',
      backToLogin: 'Powrót do logowania',
      newPassword: 'Nowe hasło',
      updatePassword: 'Zaktualizuj hasło',
      verifyEmail: 'Zweryfikuj email',
      verifyEmailDesc: 'Sprawdź skrzynkę i kliknij link weryfikacyjny.',
      resendEmail: 'Wyślij ponownie',
      errorTitle: 'Błąd',
      reqLength: 'Co najmniej 8 znaków',
      reqUpper: 'Co najmniej jedna wielka litera',
      reqDigit: 'Co najmniej jedna cyfra',
      reqSpecial: 'Co najmniej jeden znak specjalny',
      reqMatch: 'Hasła są zgodne',
    },
  })
  .build();

type I18n = typeof ofTypeI18n;
export { useI18n, type I18n };
