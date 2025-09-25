import {getWeekFlashcardCount} from '@/lib/actions/profile/week'
import {reactQueryHookFactory} from '@/lib/reactQueryHookFactory'

export const {useGeneratedHook: useWeekFlashcardCount, prefetch: prefetchWeekFlashcardCount} = reactQueryHookFactory({
	queryKey: ['profile', 'weekFlashcardCount'],
	queryFn: getWeekFlashcardCount,
	staleTime: Infinity,
})
