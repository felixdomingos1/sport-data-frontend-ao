import { useState, useEffect, useCallback } from 'react';
import { assinaturaService } from '@/infrastructure/services/assinatura.service';
import { useAuthStore } from '@/store/auth.store';

let cachedAtiva: boolean | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 1 minuto

const SUBSCRIPTION_UPDATED = 'sportdata:subscription-updated';

export function notifySubscriptionActivated() {
  cachedAtiva = true;
  cacheTimestamp = Date.now();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(SUBSCRIPTION_UPDATED, { detail: { active: true } }),
    );
  }
}

export function invalidateSubscriptionCache() {
  cachedAtiva = null;
  cacheTimestamp = 0;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(SUBSCRIPTION_UPDATED, { detail: { active: null } }),
    );
  }
}

export function useSubscriptionGuard() {
  const { isAuthenticated } = useAuthStore();
  const [hasActivePlan, setHasActivePlan] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkSubscription = useCallback(async () => {
    if (!isAuthenticated) {
      setHasActivePlan(null);
      return;
    }

    if (cachedAtiva !== null && Date.now() - cacheTimestamp < CACHE_TTL) {
      setHasActivePlan(cachedAtiva);
      return;
    }

    setChecking(true);
    try {
      const { ativa } = await assinaturaService.minhasAssinaturas();
      cachedAtiva = !!ativa;
      cacheTimestamp = Date.now();
      setHasActivePlan(!!ativa);
    } catch {
      setHasActivePlan(false);
    } finally {
      setChecking(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ active: boolean | null }>).detail;
      if (detail?.active === true) {
        setHasActivePlan(true);
        setChecking(false);
        return;
      }
      if (detail?.active === null) {
        checkSubscription();
      }
    };
    window.addEventListener(SUBSCRIPTION_UPDATED, handler);
    return () => window.removeEventListener(SUBSCRIPTION_UPDATED, handler);
  }, [checkSubscription]);

  return { hasActivePlan, checking, checkSubscription };
}
