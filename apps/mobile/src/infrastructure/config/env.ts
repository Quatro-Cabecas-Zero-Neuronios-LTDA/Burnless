// O Expo só injeta variáveis EXPO_PUBLIC_* quando acessadas literalmente
// (`process.env.EXPO_PUBLIC_X`), sem desestruturação.
export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000',
} as const;
