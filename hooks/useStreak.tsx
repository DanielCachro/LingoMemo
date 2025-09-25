import {getStreakData} from '@/lib/actions/profile/streak'
import {reactQueryHookFactory} from '@/lib/reactQueryHookFactory'

export const {useGeneratedHook: useStreak, prefetch: prefetchStreak} = reactQueryHookFactory({
	queryKey: ['profile', 'streak'],
	queryFn: getStreakData,
	staleTime: Infinity,
})
