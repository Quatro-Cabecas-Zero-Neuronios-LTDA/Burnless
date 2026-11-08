import { useEffect, useState } from 'react';

import type { ApiConnectivity } from '@/application/health/check-api-health';
import { container } from '@/di/container';

type State = ApiConnectivity | 'checking';

const checkApiHealth = () => container.checkApiHealth.execute();

export function useApiHealth() {
  const [state, setState] = useState<State>('checking');

  useEffect(() => {
    let active = true;
    void checkApiHealth().then((result) => {
      if (active) setState(result);
    });
    return () => {
      active = false;
    };
  }, []);

  const refresh = async () => {
    setState('checking');
    setState(await checkApiHealth());
  };

  return { state, refresh };
}
