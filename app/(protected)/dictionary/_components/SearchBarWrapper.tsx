'use client'
import SearchBar from '@/components/SearchBar'
import {useRouter} from 'next/navigation'
import {FormEvent, useTransition} from 'react'
import EntrySkeleton from './EntrySkeleton'

export default function SearchBarWrapper({targetLang}: {targetLang: string}) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const search = formData.get('search')?.toString()?.trim()

		const params = new URLSearchParams()
		startTransition(() => {
			if (search) {
				params.set('search', search)
				params.set('lang', targetLang)

				router.push(`?${params.toString()}`)
			} else {
				router.push('?')
			}
		})
	}
	return (
		<div className='space-y-48'>
			<SearchBar onSubmit={onSubmit} placeholder='Search for a dictionary entry...' />
			{isPending && <EntrySkeleton />}
		</div>
	)
}
