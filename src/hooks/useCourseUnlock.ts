'use client';
import { useQuery } from '@tanstack/react-query';
import { useLessonProgress } from './useLessonProgress';
import { isFeatureEnabled } from '@/lib/featureFlags';

export function useCourseUnlock(courseSlug: string, lessonId: string) {
  const enabled = isFeatureEnabled('COURSE_PREREQUISITES_ENABLED');
  const { getLessonStatus } = useLessonProgress({ courseSlug, autoSync: false });

  const { data: prerequisites, isLoading } = useQuery({
    queryKey: ['lesson-prerequisites', lessonId],
    queryFn: async () => {
      const res = await fetch(`/api/content/lessons/${lessonId}/prerequisites/`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.prerequisites as string[];
    },
    enabled: !!lessonId && enabled,
    staleTime: 1000 * 60 * 10,
  });

  const checkUnlock = async () => {
    if (!enabled || !prerequisites?.length) return { unlocked: true, reason: null };
    
    const statuses = await Promise.all(
      prerequisites.map(id => getLessonStatus(id))
    );
    
    const allComplete = statuses.every(status => status === 'completed');
    return {
      unlocked: allComplete,
      reason: allComplete ? null : `Complete as ${prerequisites.length} aula(s) anterior(es) para liberar.`
    };
  };

  return { checkUnlock, enabled, isLoadingPrereqs: isLoading };
}
