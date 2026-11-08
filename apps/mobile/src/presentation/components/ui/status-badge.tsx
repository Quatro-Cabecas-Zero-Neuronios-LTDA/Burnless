import { Text, View } from 'react-native';

type Tone = 'success' | 'warning' | 'danger' | 'neutral';

const TONES: Record<Tone, { container: string; dot: string; text: string }> = {
  success: { container: 'bg-brand-50', dot: 'bg-brand-500', text: 'text-brand-700' },
  warning: { container: 'bg-amber-50', dot: 'bg-amber-500', text: 'text-amber-700' },
  danger: { container: 'bg-red-50', dot: 'bg-red-500', text: 'text-red-700' },
  neutral: { container: 'bg-zinc-100', dot: 'bg-zinc-400', text: 'text-zinc-600' },
};

interface StatusBadgeProps {
  tone: Tone;
  label: string;
}

export function StatusBadge({ tone, label }: StatusBadgeProps) {
  const styles = TONES[tone];
  return (
    <View
      className={`flex-row items-center gap-2 self-start rounded-full px-3 py-1 ${styles.container}`}
    >
      <View className={`h-2 w-2 rounded-full ${styles.dot}`} />
      <Text className={`text-sm font-medium ${styles.text}`}>{label}</Text>
    </View>
  );
}
