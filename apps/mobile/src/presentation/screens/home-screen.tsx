import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { container } from '@/di/container';
import { StatusBadge } from '@/presentation/components/ui/status-badge';
import { useApiHealth } from '@/presentation/hooks/use-api-health';

const STATUS = {
  checking: { tone: 'neutral', label: 'Verificando…' },
  online: { tone: 'success', label: 'API online' },
  degraded: { tone: 'warning', label: 'API sem banco de dados' },
  offline: { tone: 'danger', label: 'API offline' },
} as const;

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { state, refresh } = useApiHealth();
  const status = STATUS[state];

  return (
    <View
      className="flex-1 bg-white px-6 dark:bg-zinc-950"
      style={{ paddingTop: insets.top + 32, paddingBottom: insets.bottom + 24 }}
    >
      <Text className="text-4xl font-bold text-brand-600">Burnless</Text>
      <Text className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
        Acompanhe seu dia e evite o esgotamento.
      </Text>

      <View className="mt-10 gap-3 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
        <Text className="text-sm font-semibold uppercase text-zinc-500">Conexão com a API</Text>
        <StatusBadge tone={status.tone} label={status.label} />
        <Text className="text-xs text-zinc-500" selectable>
          {container.apiUrl}
        </Text>
        <Pressable
          onPress={refresh}
          disabled={state === 'checking'}
          className="mt-2 items-center rounded-xl bg-brand-600 py-3 active:bg-brand-700 disabled:opacity-50"
        >
          <Text className="font-semibold text-white">Verificar novamente</Text>
        </Pressable>
      </View>
    </View>
  );
}
