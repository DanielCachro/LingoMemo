'use client'
import type {FlashcardsFilter} from '@/app/@modal/flashcards/(.)filter/page'
import type {FlashcardsSort} from '@/app/@modal/flashcards/(.)sort/page'
import {FlashcardsApiResponse} from '@/app/api/flashcards/route'
import {useModalData} from '@/app/ModalDataProvider'
import SearchBar from '@/components/SearchBar'
import {faFilter, faUpDown} from '@fortawesome/free-solid-svg-icons'
import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query'
import {useInView} from 'motion/react'
import {Fragment, useEffect, useRef} from 'react'
import FlashcardsStatus from '../../study/_components/FlashcardsStatus'
import Card from './Card'
import SearchOptionsLinkButton from './SearchOptionsLinkButton'

export default function Cards() {
	const queryClient = useQueryClient()
	const {getData} = useModalData()
	const filter = getData<FlashcardsFilter>('flashcardsFilter') || {}
	const sort = getData<FlashcardsSort>('flashcardsSort') || []

	const fetchFlashcards = async ({pageParam}: {pageParam?: number}): Promise<FlashcardsApiResponse> => {
		const res = await fetch(`/api/flashcards?limit=10&cursor=${pageParam}`, {
			headers: {'Content-Type': 'application/json'},
			method: 'POST',
			body: JSON.stringify({filter, sort}),
		})
		if (!res.ok) {
			throw new Error('Error fetching flashcards')
		}
		const data = await res.json()
		return data as FlashcardsApiResponse
	}

	const {data, error, fetchNextPage, isFetchingNextPage, status} = useInfiniteQuery({
		queryKey: ['flashcards', JSON.stringify(filter), JSON.stringify(sort)],
		queryFn: fetchFlashcards,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		initialPageParam: 0,
		getNextPageParam: (lastPage, pages) => lastPage.cursor,
	})

	const ref = useRef(null)
	const isInView = useInView(ref)

	useEffect(() => {
		fetchNextPage()
	}, [isInView, fetchNextPage])

	useEffect(() => {
		queryClient.removeQueries({
			queryKey: ['flashcards'],
		})
	}, [queryClient])

	return (
		<div className='space-y-16'>
			<div className='flex gap-4'>
				<SearchBar
					className='grow [&_button]:pl-12 [&_input]:py-12 [&_input]:pr-12'
					placeholder='Search flashcards...'
				/>
				<SearchOptionsLinkButton href='/flashcards/sort' icon={faUpDown} isActive={sort.length > 0} />
				<SearchOptionsLinkButton
					href='/flashcards/filter'
					icon={faFilter}
					isActive={Object.values(filter).some(Boolean)}
				/>
			</div>

			{status === 'pending' ? (
				<p>Loading...</p>
			) : status === 'error' ? (
				// TODO: Move FlashcardsStatus to /components and make it reusable
				<div className='mt-96'>
					<>
						{console.log(error)}
						<FlashcardsStatus status='error' />
					</>
				</div>
			) : (
				data &&
				data.pages.map((page, index) => (
					<Fragment key={index}>
						{page.flashcards.map(flashcard => (
							<Card key={flashcard.id} flashcard={flashcard} />
						))}
					</Fragment>
				))
			)}

			{/* <Card /> */}
			<div ref={ref}>{isFetchingNextPage ? 'Loading more...' : undefined}</div>
		</div>
	)
}
