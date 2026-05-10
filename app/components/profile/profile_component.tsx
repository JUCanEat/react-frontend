import React from 'react';
import { TopBar } from '~/components/shared/top_bar';
import { BottomNav } from '~/components/shared/bottom_nav';
import { useKeycloak } from '@react-keycloak/web';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { appRoutes } from '~/lib/app_routes';
import { useGetPreferences, useGetCurrentUserWithToken, savePreferences } from '~/api/user_service';
import type { TagValue } from '~/interfaces';

const INCLUDE_TAGS: TagValue[] = ['VEGAN', 'VEGETARIAN', 'ITALIAN', 'POLISH', 'ASIAN', 'FAST_FOOD'];
const EXCLUDE_TAGS: TagValue[] = ['GLUTEN', 'LACTOSE', 'NUTS'];

function PreferencesSection({
  token,
  userReady,
  t,
}: {
  token: string | undefined;
  userReady: boolean;
  t: (key: string) => string;
}) {
  const { data: prefsData, isLoading } = useGetPreferences(userReady ? token : undefined);
  const [include, setInclude] = React.useState<TagValue[]>([]);
  const [exclude, setExclude] = React.useState<TagValue[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!prefsData) return;
    setInclude(prefsData.filter(p => p.preferenceType === 'INCLUDE').map(p => p.tagValue));
    setExclude(prefsData.filter(p => p.preferenceType === 'EXCLUDE').map(p => p.tagValue));
  }, [prefsData]);

  const toggle = (list: TagValue[], setList: (v: TagValue[]) => void, value: TagValue) => {
    setList(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      // Ensure user exists in backend DB before saving preferences
      const meRes = await fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } });
      const meText = await meRes.text().catch(() => '');
      console.log('[preferences] /api/users/me ->', meRes.status, meText.slice(0, 200));
      if (!meRes.ok) {
        throw new Error(`/api/users/me failed (${meRes.status}): ${meText}`);
      }
      await savePreferences(token, [
        ...include.map(tagValue => ({ tagValue, preferenceType: 'INCLUDE' as const })),
        ...exclude.map(tagValue => ({ tagValue, preferenceType: 'EXCLUDE' as const })),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profile.failedToSavePreferences'));
    } finally {
      setSaving(false);
    }
  };

  const tagLabel = (tag: TagValue): string => {
    const map: Partial<Record<TagValue, string>> = {
      VEGAN: t('filters.vegan'),
      VEGETARIAN: t('filters.vegetarian'),
      GLUTEN: t('menuForm.allergenGluten'),
      LACTOSE: t('menuForm.allergenLactose'),
      NUTS: t('menuForm.allergenNuts'),
      ITALIAN: t('profile.tagItalian'),
      POLISH: t('profile.tagPolish'),
      ASIAN: t('profile.tagAsian'),
      FAST_FOOD: t('profile.tagFastFood'),
    };
    return map[tag] ?? tag;
  };

  if (isLoading) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.loadingPreferences')}</p>
    );
  }

  return (
    <div className="w-full space-y-5">
      <div>
        <p
          className="text-xs uppercase tracking-widest mb-1"
          style={{ color: '#009DE0' }}
        >
          {t('profile.preferences')}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('profile.preferencesSubtitle')}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('profile.iPrefer')}
        </p>
        <div className="flex flex-wrap gap-2">
          {INCLUDE_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(include, setInclude, tag)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                include.includes(tag)
                  ? 'bg-[#009DE0] text-white border-[#009DE0]'
                  : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700'
              }`}
            >
              {tagLabel(tag)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('profile.iAvoid')}
        </p>
        <div className="flex flex-wrap gap-2">
          {EXCLUDE_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(exclude, setExclude, tag)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                exclude.includes(tag)
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700'
              }`}
            >
              {tagLabel(tag)}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-60"
        style={{ backgroundColor: saved ? '#16a34a' : '#009DE0' }}
      >
        {saving ? '…' : saved ? t('profile.preferencesSaved') : t('profile.savePreferences')}
      </button>
    </div>
  );
}

export default function ProfileComponent() {
  const { keycloak, initialized } = useKeycloak();
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!initialized) {
    return (
      <div className="relative min-h-screen bg-transparent dark:bg-transparent">
        <TopBar isLoginPage={false} />
        <div
          className="w-full flex items-center justify-center"
          style={{ height: 'calc(100vh - 150px)' }}
        >
          <p className="text-sm opacity-60 text-gray-900 dark:text-gray-200">
            {t('profile.loadingProfile')}
          </p>
        </div>
        <BottomNav />
      </div>
    );
  }

  const token = keycloak.tokenParsed;
  const roles = token?.realm_access?.roles || [];
  const isOwner = roles.includes('restaurant_owner');
  const { data: backendUser } = useGetCurrentUserWithToken(keycloak.token);

  if (!token) {
    return (
      <div className="flex flex-col h-screen w-full bg-transparent dark:bg-transparent">
        <TopBar isLoginPage={false} />
        <div className="flex-1 overflow-y-auto pb-28 md:pb-16">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-1 pb-6 lg:pt-2 lg:pb-8 space-y-4">
            <section className="rounded-3xl border border-sky-100 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/95 shadow-sm p-4 sm:p-5">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('profile.pageTitle')}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                {t('profile.pageSubtitleSignedOut')}
              </p>
            </section>

            <div className="flex flex-col items-center justify-center gap-4 px-2 sm:px-6">
              <button
                className="w-full max-w-sm py-3 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: '#009DE0' }}
                onClick={() => keycloak.login({ redirectUri: window.location.origin + '/profile' })}
              >
                {t('profile.logIn')}
              </button>
              <button
                className="w-full max-w-sm py-3 rounded-xl text-sm font-semibold text-white bg-[#1B1B1B] sign-up-btn"
                onClick={() =>
                  keycloak.register({ redirectUri: window.location.origin + '/profile' })
                }
              >
                {t('profile.signUp')}
              </button>
            </div>
          </div>
        </div>
        <BottomNav page={'profile'} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-transparent dark:bg-transparent">
      <TopBar isLoginPage={false} />
      <div className="flex-1 overflow-y-auto pb-28 md:pb-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-1 pb-6 lg:pt-2 lg:pb-8 space-y-4">
          <section className="rounded-3xl border border-sky-100 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/95 shadow-sm p-4 sm:p-5">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('profile.pageTitle')}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              {t('profile.pageSubtitleSignedIn')}
            </p>
          </section>

          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-8 w-full max-w-sm px-2 sm:px-6">
              <div className="flex flex-col items-center gap-1">
                <p
                  className="text-xs uppercase tracking-widest mb-1"
                  style={{ color: '#009DE0' }}
                >
                  {t('profile.nameLabel')}
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {token.given_name} {token.family_name}
                </p>
              </div>

              <div className="w-full h-px bg-gray-300 dark:bg-zinc-600" />

              <div className="flex flex-col items-center gap-1">
                <p
                  className="text-xs uppercase tracking-widest mb-1"
                  style={{ color: '#009DE0' }}
                >
                  {t('profile.usernameLabel')}
                </p>
                <p className="text-lg text-gray-800 dark:text-white">@{token.preferred_username}</p>
              </div>

              <div className="w-full h-px bg-gray-300 dark:bg-zinc-600" />

              <div className="flex flex-col items-center gap-1">
                <p
                  className="text-xs uppercase tracking-widest mb-1"
                  style={{ color: '#009DE0' }}
                >
                  {t('profile.emailLabel')}
                </p>
                <p className="text-lg text-gray-800 dark:text-white">{token.email}</p>
              </div>

              {isOwner && (
                <button
                  className="w-full mt-2 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ backgroundColor: '#009DE0' }}
                  onClick={() => navigate(appRoutes.staffManager)}
                >
                  {t('profile.openManagerPanel')}
                </button>
              )}

              {!isOwner && (
                <>
                  <div className="w-full h-px bg-gray-300 dark:bg-zinc-600" />
                  <PreferencesSection
                    token={keycloak.token}
                    userReady={!!backendUser}
                    t={t}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <BottomNav page={'profile'} />
    </div>
  );
}
