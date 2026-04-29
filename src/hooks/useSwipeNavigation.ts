'use client';

import { useDrag } from '@use-gesture/react';
import { useCallback, useRef } from 'react';

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number; // Pixels mínimos para detectar swipe (default: 50)
  lockDirection?: 'horizontal' | 'vertical'; // Previne scroll acidental
}

export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  lockDirection = 'horizontal',
}: SwipeConfig = {}) {
  const startX = useRef(0);
  const startY = useRef(0);
  const isSwiping = useRef(false);

  const bind = useDrag(
    ({ down, movement: [mx, my], initial: [x0, y0] }) => {
      // Inicia swipe
      if (!isSwiping.current && Math.abs(mx) > 10) {
        isSwiping.current = true;
        startX.current = x0;
        startY.current = y0;
      }

      // Cancela se direção bloqueada
      if (lockDirection === 'horizontal' && Math.abs(my) > Math.abs(mx) * 2) {
        return;
      }

      // Ao soltar, verifica se foi swipe válido
      if (!down && isSwiping.current) {
        isSwiping.current = false;
        
        if (mx > threshold && onSwipeRight) {
          onSwipeRight();
        } else if (mx < -threshold && onSwipeLeft) {
          onSwipeLeft();
        }
      }
    },
    {
      axis: lockDirection === 'horizontal' ? 'x' : undefined,
      filterTaps: true,
      threshold: 10, // Sensibilidade inicial
    }
  );

  return bind;
}
