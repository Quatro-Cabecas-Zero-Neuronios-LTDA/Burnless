import Constants from 'expo-constants';

const API_PORT = 8000;

/**
 * Em desenvolvimento, usa o mesmo IP do Metro (o host do QR code) para achar a API
 * na sua máquina. Funciona no emulador e no celular na mesma rede Wi-Fi.
 * `localhost` não serve no Android: lá ele é o próprio aparelho.
 */
function devMachineApiUrl(): string | undefined {
  if (!__DEV__) return undefined;
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  return host ? `http://${host}:${API_PORT}` : undefined;
}

// O Expo só injeta variáveis EXPO_PUBLIC_* quando acessadas literalmente
// (`process.env.EXPO_PUBLIC_X`), sem desestruturação.
export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? devMachineApiUrl() ?? `http://localhost:${API_PORT}`,
} as const;
