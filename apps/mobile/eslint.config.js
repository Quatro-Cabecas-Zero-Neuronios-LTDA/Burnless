// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

/**
 * Regra de dependência entre camadas (DDD horizontal):
 *   presentation → application → domain  (presentation recebe tudo pronto via `di/`)
 *   infrastructure → application/domain  (implementa os ports)
 * Os padrões pegam imports tanto por alias (`@/...`) quanto relativos.
 */
const FRAMEWORKS = ['react', 'react-native', 'react-native-*', 'expo', 'expo-*', 'nativewind'];

const restrictLayer = (layer, forbidden, message) => ({
  files: [`src/${layer}/**/*.{ts,tsx}`],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: forbidden.map((dir) => (FRAMEWORKS.includes(dir) ? dir : `**/${dir}/**`)),
            message,
          },
        ],
      },
    ],
  },
});

module.exports = defineConfig([
  expoConfig,
  { ignores: ['dist/*', '.expo/*'] },
  restrictLayer(
    'domain',
    [...FRAMEWORKS, 'application', 'infrastructure', 'presentation', 'di'],
    'domain é TypeScript puro: não depende de framework nem de outras camadas.',
  ),
  restrictLayer(
    'application',
    [...FRAMEWORKS, 'infrastructure', 'presentation', 'di'],
    'application só conhece o domain e seus próprios ports.',
  ),
  restrictLayer(
    'infrastructure',
    ['presentation', 'di'],
    'infrastructure implementa ports; não conhece a UI.',
  ),
  restrictLayer(
    'presentation',
    ['infrastructure'],
    'presentation não usa infrastructure direto: receba as dependências por `@/di/container`.',
  ),
]);
