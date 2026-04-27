import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from '../useProgressStore';
import { useAppStore } from '../useAppStore';

// ── useProgressStore (fonte de verdade canônica) ─────────────────────────────
describe('useProgressStore — trilhas', () => {
  beforeEach(() => {
    useProgressStore.getState().resetProgress();
  });

  it('should initialize with 7 trails', () => {
    const { trails } = useProgressStore.getState();
    expect(trails).toHaveLength(7);
    expect(trails[0].id).toBe(1);
    expect(trails[0].isUnlocked).toBe(true);
    expect(trails[1].isUnlocked).toBe(false);
  });

  it('should complete a step and update status', () => {
    const { completeStep } = useProgressStore.getState();

    completeStep(1, 'ouvir');

    const { trails } = useProgressStore.getState();
    const trail1 = trails.find((t) => t.id === 1);
    expect(trail1?.progress.ouvir).toBe(true);
    expect(trail1?.status).toBe('in_progress');
  });

  it('should unlock the next trail when current is completed', () => {
    const { completeStep } = useProgressStore.getState();

    completeStep(1, 'ouvir');
    completeStep(1, 'estudar');
    completeStep(1, 'avaliar');

    const { trails } = useProgressStore.getState();
    const trail1 = trails.find((t) => t.id === 1);
    const trail2 = trails.find((t) => t.id === 2);

    expect(trail1?.status).toBe('completed');
    expect(trail2?.isUnlocked).toBe(true);
  });

  it('should unlock all trails when unlockAllTrails is called', () => {
    const { unlockAllTrails } = useProgressStore.getState();

    unlockAllTrails();

    const { trails } = useProgressStore.getState();
    trails.forEach((trail) => {
      expect(trail.isUnlocked).toBe(true);
      expect(trail.status).toBe('completed');
    });
  });
});

// ── useAppStore (myths only) ─────────────────────────────────────────────────
describe('useAppStore — mitos revelados', () => {
  beforeEach(() => {
    useAppStore.getState().resetMyths();
  });

  it('should start with no revealed myths', () => {
    expect(useAppStore.getState().revealedMyths).toHaveLength(0);
  });

  it('should reveal a myth', () => {
    useAppStore.getState().revealMyth('myth-autonomia');
    expect(useAppStore.getState().revealedMyths).toContain('myth-autonomia');
  });

  it('should not add duplicate myths', () => {
    useAppStore.getState().revealMyth('myth-autonomia');
    useAppStore.getState().revealMyth('myth-autonomia');
    expect(useAppStore.getState().revealedMyths).toHaveLength(1);
  });
});

