/* eslint-disable @typescript-eslint/no-explicit-any */
import {FetchQueryOptions, QueryClient, useQuery, useQueryClient, UseQueryResult} from '@tanstack/react-query'

type GenericQueryHookOptions<TQueryFn extends (...args: any[]) => Promise<any>> = FetchQueryOptions<
	Awaited<ReturnType<TQueryFn>> & {queryFn: TQueryFn}
>

export function reactQueryHookFactory<TQueryFn extends (...args: any[]) => Promise<any>>(
	options: GenericQueryHookOptions<TQueryFn>,
) {
	type QueryReturnType = Awaited<ReturnType<TQueryFn>>

	const useGeneratedHook = (): UseQueryResult<QueryReturnType> & {invalidate: () => Promise<void>} => {
		const queryClient = useQueryClient()
		const query = useQuery<QueryReturnType>({
			...options,
		})

		const invalidate = async () => {
			await queryClient.invalidateQueries({queryKey: options.queryKey})
		}

		return {...query, invalidate}
	}

	const prefetch = async (queryClient: QueryClient) => {
		await queryClient.prefetchQuery({
			...options,
		})
	}

	return {useGeneratedHook, prefetch}
}
