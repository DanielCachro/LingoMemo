'use client'
import {useEffect} from 'react'

import PrimaryButton from '@/components/PrimaryButton'

interface Props {
	error: Error
	reset: () => void
}

export default function Error({error, reset}: Props) {
	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<div className='space-y-24'>
			<p className='font-bold'>{error.message ?? 'An unknown error has occurred.'}</p>
			<PrimaryButton onClick={() => reset()}>Try again</PrimaryButton>
		</div>
	)
}
