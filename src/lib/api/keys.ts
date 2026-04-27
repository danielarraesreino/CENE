export interface ClinicalFilters {
  userId?: string;
  status?: string;
  [key: string]: any;
}

export const clinicalKeys = {
  all: ['clinical'] as const,
  lists: () => [...clinicalKeys.all, 'list'] as const,
  list: (filters: ClinicalFilters) => 
    [...clinicalKeys.lists(), { filters }] as const,
  details: () => [...clinicalKeys.all, 'detail'] as const,
  detail: (id: string | number) => 
    [...clinicalKeys.details(), id] as const,
};
