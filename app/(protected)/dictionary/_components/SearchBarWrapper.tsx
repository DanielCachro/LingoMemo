'use client'
import SearchBar from '@/components/SearchBar'
import {useRouter} from 'next/navigation'
import {ChangeEvent, FormEvent, useCallback, useRef, useTransition} from 'react'
import EntrySkeleton from './EntrySkeleton'

export default function SearchBarWrapper({targetLang}: {targetLang: string}) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	// Ref for debouncing pattern
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	// Main search handler that updates the URL with the search term and target language
	const handleSearch = useCallback(
		(searchValue: string) => {
			const params = new URLSearchParams()
			startTransition(() => {
				if (searchValue) {
					params.set('search', searchValue)
					params.set('lang', targetLang)
					router.push(`?${params.toString()}`)
				} else {
					router.push('?')
				}
			})
		},
		[router, targetLang],
	)

	// Handler for input change events, debounced to avoid excessive updates
	function onChange(event: ChangeEvent<HTMLInputElement>) {
		const searchTerm = event.currentTarget.value.trim()

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}

		timeoutRef.current = setTimeout(() => {
			handleSearch(searchTerm)
		}, 500)
	}

	// Handler for form submission, immediately triggers the search without waiting for debounce
	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const searchTerm = formData.get('search')?.toString()?.trim() || ''

		// Clear any existing debounce timeout to prevent duplicate searches
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}

		handleSearch(searchTerm)
	}

	return (
		<div className='space-y-48'>
			<SearchBar onSubmit={onSubmit} onChange={onChange} placeholder='Search for a dictionary entry...' />
			{isPending && <EntrySkeleton />}
		</div>
	)
}
