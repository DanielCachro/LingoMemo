
import {getStreakData} from '@/lib/actions/profile/streak'
import {useQuery, useQueryClient, UseQueryResult} from '@tanstack/react-query'

const QUERY_KEYS = ['profile', 'streak']

type QueryReturnType = Awaited<ReturnType<typeof getStreakData>>

export const useStreak = (): UseQueryResult<QueryReturnType> & {invalidate: () => Promise<void>} => {
	const queryClient = useQueryClient()
	const query = useQuery({
		queryKey: QUERY_KEYS,
		queryFn: getStreakData,
		staleTime: Infinity,
	})

	const invalidate = async () => {
		await queryClient.invalidateQueries({queryKey: QUERY_KEYS})
	}

	return {...query, invalidate}
}

export const prefetchStreak = async (queryClient: ReturnType<typeof useQueryClient>) => {
	await queryClient.prefetchQuery({
		queryKey: QUERY_KEYS,
		queryFn: getStreakData,
	})
}



