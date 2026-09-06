import { useQuery } from '@tanstack/react-query';
import { getInstructors } from '../api/catalog';

/** The instructor list. Rarely changes, so it stays fresh for a while. */
export function useInstructors() {
  return useQuery({
    queryKey: ['instructors'],
    queryFn: getInstructors,
    staleTime: 5 * 60_000,
  });
}
