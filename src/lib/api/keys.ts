export interface ClinicalFilters {
  userId?: string;
  type?: string;
  status?: 'active' | 'archived';
  dateFrom?: string;
  dateTo?: string;
}

export const clinicalKeys = {
  all: ['clinical'] as const,
  lists: () => [...clinicalKeys.all, 'list'] as const,
  list: (filters: ClinicalFilters) => 
    [...clinicalKeys.lists(), { filters }] as const,
  details: () => [...clinicalKeys.all, 'detail'] as const,
  detail: (id: string | number) => 
    [...clinicalKeys.details(), id] as const,
  progress: (courseSlug: string) => [...clinicalKeys.all, 'progress', courseSlug] as const,
  lessonProgress: (courseSlug: string, lessonId: string) => 
    [...clinicalKeys.progress(courseSlug), lessonId] as const,
};

export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (filters: { role?: string }) => [...courseKeys.lists(), filters] as const,
  detail: (slug: string) => [...courseKeys.all, 'detail', slug] as const,
};
