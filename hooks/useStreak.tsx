import {getStreakData} from '@/lib/actions/profile/streak'
import {useQuery, useQueryClient, UseQueryResult} from '@tanstack/react-query'

const QUERY_KEY = 'streak'

type StreakResponse = {
	streakCount: number
	longestStreak: number
}

export const useStreak = (): UseQueryResult<StreakResponse> & {invalidate: () => Promise<void>} => {
	const queryClient = useQueryClient()
	const query = useQuery({
		queryKey: [QUERY_KEY],
		queryFn: getStreakData,
		staleTime: Infinity,
	})

	const invalidate = async () => {
		await queryClient.invalidateQueries({queryKey: [QUERY_KEY]})
	}

	return {...query, invalidate}
}

export const prefetchStreak = async (queryClient: ReturnType<typeof useQueryClient>) => {
	await queryClient.prefetchQuery({
		queryKey: [QUERY_KEY],
		queryFn: getStreakData,
	})
}
