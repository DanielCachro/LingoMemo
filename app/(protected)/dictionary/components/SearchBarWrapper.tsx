'use client'
import SearchBar from '@/components/SearchBar'
import {useRouter} from 'next/navigation'
import {FormEvent} from 'react'

export default function SearchBarWrapper() {
	const router = useRouter()

	function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		const search = formData.get('search')?.toString()?.trim()
		if (search) {
			router.push(`?search=${encodeURIComponent(search)}`)
		} else {
			router.push('?')
		}
	}
	return <SearchBar onSubmit={onSubmit} />
}
