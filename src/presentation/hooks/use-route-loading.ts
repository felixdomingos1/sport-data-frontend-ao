import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoadingStore } from '@/store/loading.store';

export function useRouteLoading(message = 'A preparar a página...', minDuration = 600) {
  const location = useLocation();
  const { show, hide } = useLoadingStore();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    show(message);
    const timer = setTimeout(hide, minDuration);

    return () => {
      clearTimeout(timer);
      hide();
    };
  }, [location.pathname, message, minDuration, show, hide]);
}
