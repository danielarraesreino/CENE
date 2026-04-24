import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    const { resetProgress } = useAppStore.getState();
    resetProgress();
  });

  it('should initialize with 7 trails', () => {
    const { trails } = useAppStore.getState();
    expect(trails).toHaveLength(7);
    expect(trails[0].id).toBe(1);
    expect(trails[0].isUnlocked).toBe(true);
    expect(trails[1].isUnlocked).toBe(false);
  });

  it('should complete a step and update status', () => {
    const { completeStep } = useAppStore.getState();
    
    completeStep(1, 'ouvir');
    
    const { trails } = useAppStore.getState();
    const trail1 = trails.find(t => t.id === 1);
    expect(trail1?.progress.ouvir).toBe(true);
    expect(trail1?.status).toBe('in_progress');
  });

  it('should unlock the next trail when current is completed', () => {
    const { completeStep } = useAppStore.getState();
    
    // Complete all steps for trail 1
    completeStep(1, 'ouvir');
    completeStep(1, 'estudar');
    completeStep(1, 'avaliar');
    
    const { trails } = useAppStore.getState();
    const trail1 = trails.find(t => t.id === 1);
    const trail2 = trails.find(t => t.id === 2);
    
    expect(trail1?.status).toBe('completed');
    expect(trail2?.isUnlocked).toBe(true);
  });

  it('should unlock all trails when unlockAllTrails is called', () => {
    const { unlockAllTrails } = useAppStore.getState();
    
    unlockAllTrails();
    
    const { trails } = useAppStore.getState();
    trails.forEach(trail => {
      expect(trail.isUnlocked).toBe(true);
      expect(trail.status).toBe('completed');
    });
  });
});
