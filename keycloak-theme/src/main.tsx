import { createRoot } from 'react-dom/client';
import { StrictMode, Suspense } from 'react';
import { KcPage, type KcContext } from './login/KcPage';

declare global {
  interface Window {
    kcContext?: KcContext;
  }
}

// Mock data for development/testing
const mockKcContext: KcContext = {
  pageId: 'login.ftl',
  url: {
    loginAction: '#',
    loginResetCredentialsUrl: '#',
    registrationUrl: '#',
    loginUrl: '#',
    resourcesPath: '',
    resourcesCommonPath: '',
    loginRestartFlowUrl: '',
    oauth: undefined as any,
  },
  realm: {
    name: 'JuCanEat',
    displayName: 'JuCanEat',
    displayNameHtml: 'JuCanEat',
    loginWithEmailAllowed: true,
    rememberMe: true,
    password: true,
    resetPasswordAllowed: true,
    registrationAllowed: true,
    registrationEmailAsUsername: false,
    duplicateEmailsAllowed: false,
    editUsernameAllowed: false,
    internationalizationEnabled: false,
  },
  social: {
    providers: [
      {
        providerId: 'google',
        displayName: 'Google',
        loginUrl: '#',
        alias: 'google',
      },
    ],
  },
  message: undefined,
  locale: {
    currentLanguageTag: 'en',
  },
  auth: undefined,
  client: {
    clientId: 'jucaneat-frontend',
  },
  login: {
    username: '',
  },
  scripts: [],
  isAppInitiatedAction: false,
  messagesPerField: {
    existsError: () => false,
    get: () => '',
    exists: () => false,
    printIfExists: () => undefined,
    getFirstError: () => '',
  },
} as any;

const kcContext = window.kcContext ?? mockKcContext;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <KcPage kcContext={kcContext} />
    </Suspense>
  </StrictMode>
);
