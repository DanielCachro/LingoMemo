'use client'
import {initialFlashcardsFilter} from '@/app/@modal/flashcards/(.)filter/initial'
import type {FlashcardsFilter} from '@/app/@modal/flashcards/(.)filter/schema'
import {initialFlashcardsSortOrder} from '@/app/@modal/flashcards/(.)sort/initial'
import type {FlashcardsSort} from '@/app/@modal/flashcards/(.)sort/page'
import {FlashcardsApiResponse} from '@/app/api/flashcards/route'
import {useModalData} from '@/app/ModalDataProvider'
import SearchBar from '@/components/SearchBar'
import Spinner from '@/components/Spinner'
import FlashcardsStatus from '@/components/Status'
import {faFilter, faUpDown} from '@fortawesome/free-solid-svg-icons'
import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import pickBy from 'lodash/pickBy'
import {useInView} from 'motion/react'
import {useRouter} from 'next/navigation'
import {Fragment, useEffect, useRef, useState} from 'react'
import BulkSelectFloatingButton from './BulkSelectFloatingButton'
import Card from './Card'
import SearchOptionsLinkButton from './SearchOptionsLinkButton'

export default function Cards() {
	const queryClient = useQueryClient()
	const {getData, setData} = useModalData()
	const router = useRouter()
	const [searchTerm, setSearchTerm] = useState<string>('')
	const lastSearchChange = useRef<number | null>(null)
	const ref = useRef(null)
	const isInView = useInView(ref)
	const filter = getData<FlashcardsFilter>('flashcardsFilter') || {}
	const sort = getData<FlashcardsSort>('flashcardsSort') || []
	const selectedCardIds = getData<number[]>('flashcardsToBulkDelete') || []

	async function fetchFlashcards({
		pageParam,
		signal,
	}: {
		pageParam?: number
		signal?: AbortSignal
	}): Promise<FlashcardsApiResponse> {
		const res = await fetch(`/api/flashcards?limit=10&cursor=${pageParam}`, {
			headers: {'Content-Type': 'application/json'},
			method: 'POST',
			body: JSON.stringify({searchTerm, filter, sort}),
			signal,
		})
		if (!res.ok) {
			throw new Error('Error fetching flashcards')
		}
		const data = await res.json()
		return data as FlashcardsApiResponse
	}

	const {data, error, fetchNextPage, isFetchingNextPage, status, hasNextPage, refetch} = useInfiniteQuery({
		queryKey: [
			'flashcards',
			searchTerm,
			pickBy(filter, value => value !== undefined),
			sort.map(option => [option.value, option.direction]),
		],
		queryFn: fetchFlashcards,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		initialPageParam: 0,
		getNextPageParam: lastPage => lastPage.cursor,
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

	function handleToggleSelection(id: number, isSelected: boolean) {
		const newSelection = isSelected ? [...selectedCardIds, id] : selectedCardIds.filter(cardId => cardId !== id)
		setData('flashcardsToBulkDelete', newSelection)
	}

	function handleClearSelection() {
		setData('flashcardsToBulkDelete', [])
	}

	function handleBulkDelete() {
		router.push('/flashcards/delete/bulk')
	}

	useEffect(() => {
		if (isInView && hasNextPage && !isFetchingNextPage && status !== 'error') {
			fetchNextPage()
		}
	}, [isInView, fetchNextPage, hasNextPage, isFetchingNextPage, status])

	useEffect(() => {
		return () => {
			queryClient.removeQueries({queryKey: ['flashcards']})
		}
	}, [queryClient])

	return (
		<div className='flex grow flex-col gap-16'>
			<div className='flex gap-4'>
				<SearchBar
					className='grow [&_button]:pl-12 [&_input]:py-12'
					placeholder='Search flashcards...'
					onChange={handleSearch}
					onSubmit={e => {
						e.preventDefault()
					}}
				/>
				<SearchOptionsLinkButton
					href='/flashcards/sort'
					icon={faUpDown}
					isActive={sort.length > 0 && !isEqual(sort, initialFlashcardsSortOrder)}
					aria-label='Sort flashcards'
				/>
				<SearchOptionsLinkButton
					href='/flashcards/filter'
					icon={faFilter}
					isActive={!isEmpty(filter) && !isEqual(filter, initialFlashcardsFilter)}
					aria-label='Filter flashcards'
				/>
			</div>

			<BulkSelectFloatingButton
				visible={selectedCardIds.length > 0}
				numberOfSelectedItems={selectedCardIds.length}
				onDelete={handleBulkDelete}
				onClear={handleClearSelection}
			/>

			{status === 'pending' ? (
				<Skeleton />
			) : status === 'error' || data?.pages[0]?.flashcards.length === 0 ? (
				<div className='mt-48 flex w-full grow items-center justify-center'>
					{status === 'error' ? (
						<>
							{console.log(error)}
							<FlashcardsStatus
								variant='vertical'
								status='error'
								buttonText='Try Again'
								onButtonClick={() => refetch()}
							/>
						</>
					) : (
						<FlashcardsStatus variant='vertical' status='empty' showButton={false}>
							<div className='space-y-8'>
								<p>Is anyone there? (Just an echo!) 👀</p>
								<p>
									There are zero flashcards in sight. You can easily change that right now by smashing that button
									above!
								</p>
							</div>
						</FlashcardsStatus>
					)}
				</div>
			) : (
				data &&
				data.pages.map((page, index) => (
					<Fragment key={index}>
						{page.flashcards.map(flashcard => (
							<Card
								key={flashcard.id}
								flashcard={flashcard}
								isSelected={selectedCardIds.includes(flashcard.id)}
								onSelectionChange={checked => handleToggleSelection(flashcard.id, checked)}
							/>
						))}
					</Fragment>
				))
			)}

			<div ref={ref} className='flex justify-center py-16'>
				{isFetchingNextPage ? <Spinner height={24} width={24} /> : undefined}
			</div>
		</div>
	)
}

export function Skeleton() {
	return (
		<div className='animate-pulse space-y-16' role='status'>
			<span className='sr-only'>Loading flashcards...</span>
			<div className='h-[9rem] rounded-sm bg-skeleton' />
			<div className='h-[9rem] rounded-sm bg-skeleton' />
			<div className='h-[9rem] rounded-sm bg-skeleton' />
			<div className='h-[9rem] rounded-sm bg-skeleton' />
			<div className='h-[9rem] rounded-sm bg-skeleton' />
		</div>
	)
}
