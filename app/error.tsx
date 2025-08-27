'use client'
import {useEffect} from 'react'

import ErrorPage from '@/components/ErrorPage'

interface Props {
	error: Error
	reset: () => void
}

export default function Error({error, reset}: Props) {
	useEffect(() => {
		console.error(error)
	}, [error])

	return <ErrorPage onBtnClick={() => reset()} />
}
