'use client'
import {initialFlashcardsFilter} from '@/app/@modal/flashcards/(.)filter/initial'
import type {FlashcardsFilter} from '@/app/@modal/flashcards/(.)filter/schema'
import {initialFlashcardsSortOrder} from '@/app/@modal/flashcards/(.)sort/initial'
import type {FlashcardsSort} from '@/app/@modal/flashcards/(.)sort/page'
import {FlashcardsApiResponse} from '@/app/api/flashcards/route'
import {useModalData} from '@/app/ModalDataProvider'
import SearchBar from '@/components/SearchBar'
import Spinner from '@/components/Spinner'
import {faFilter, faUpDown} from '@fortawesome/free-solid-svg-icons'
import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query'
import _, {pickBy} from 'lodash'
import {useInView} from 'motion/react'
import {Fragment, useEffect, useRef, useState} from 'react'
import FlashcardsStatus from '../../study/_components/FlashcardsStatus'
import Card from './Card'
import SearchOptionsLinkButton from './SearchOptionsLinkButton'

export default function Cards() {
	const queryClient = useQueryClient()
	const {getData} = useModalData()
	const [searchTerm, setSearchTerm] = useState<string>('')
	const lastSearchChange = useRef<number | null>(null)
	const filter = getData<FlashcardsFilter>('flashcardsFilter') || {}
	const sort = getData<FlashcardsSort>('flashcardsSort') || []

	const fetchFlashcards = async ({pageParam}: {pageParam?: number}): Promise<FlashcardsApiResponse> => {
		const res = await fetch(`/api/flashcards?limit=10&cursor=${pageParam}`, {
			headers: {'Content-Type': 'application/json'},
			method: 'POST',
			body: JSON.stringify({searchTerm, filter, sort}),
		})
		if (!res.ok) {
			throw new Error('Error fetching flashcards')
		}
		const data = await res.json()
		return data as FlashcardsApiResponse
	}

	const {data, error, fetchNextPage, isFetchingNextPage, status} = useInfiniteQuery({
		queryKey: [
			'flashcards',
			searchTerm,
			pickBy(filter, value => value !== undefined),
			sort.map(option => option.value),
		],
		queryFn: fetchFlashcards,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		initialPageParam: 0,
		getNextPageParam: (lastPage, _) => lastPage.cursor,
	})

	function handleSearch(event: React.FormEvent<HTMLInputElement>) {
		if (lastSearchChange.current) {
			window.clearTimeout(lastSearchChange.current)
		}

		const value = event.currentTarget.value
		lastSearchChange.current = window.setTimeout(() => {
			lastSearchChange.current = null
			setSearchTerm(value)
		}, 500)
	}

	const ref = useRef(null)
	const isInView = useInView(ref)

	useEffect(() => {
		fetchNextPage()
	}, [isInView, fetchNextPage])

	useEffect(() => {
		return () => {
			queryClient.removeQueries({queryKey: ['flashcards']})
		}
	}, [queryClient])

	return (
		<div className='space-y-16'>
			<div className='flex gap-4'>
				<SearchBar
					className='grow [&_button]:pl-12 [&_input]:py-12 [&_input]:pr-12'
					placeholder='Search flashcards...'
					onChange={handleSearch}
					onSubmit={e => {
						e.preventDefault()
					}}
				/>
				<SearchOptionsLinkButton
					href='/flashcards/sort'
					icon={faUpDown}
					isActive={sort.length > 0 && !_.isEqual(sort, initialFlashcardsSortOrder)}
				/>
				<SearchOptionsLinkButton
					href='/flashcards/filter'
					icon={faFilter}
					isActive={!_.isEmpty(filter) && !_.isEqual(filter, initialFlashcardsFilter)}
				/>
			</div>

			{status === 'pending' ? (
				<Skeleton />
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
			<div ref={ref} className='flex justify-center py-16'>
				{isFetchingNextPage ? <Spinner height={24} width={24} /> : undefined}
			</div>
		</div>
	)
}

export function Skeleton() {
	return (
		<div className='animate-pulse space-y-16'>
			<div className='h-[9rem] rounded-sm bg-skeleton' />
			<div className='h-[9rem] rounded-sm bg-skeleton' />
			<div className='h-[9rem] rounded-sm bg-skeleton' />
			<div className='h-[9rem] rounded-sm bg-skeleton' />
			<div className='h-[9rem] rounded-sm bg-skeleton' />
		</div>
	)
}
