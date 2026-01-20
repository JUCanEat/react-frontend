import Keycloak from 'keycloak-js';

let keycloak: Keycloak | null = null;

export function getKeycloak() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!keycloak) {
    keycloak = new Keycloak({
      url: import.meta.env.VITE_KEYCLOAK_URL,
      realm: 'JuCanEat',
      clientId: 'JuCanEat-frontend',
    });
  }

  return keycloak;
}
