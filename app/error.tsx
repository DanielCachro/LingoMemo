'use client'
import {useEffect} from 'react'

import PrimaryButton from '@/components/PrimaryButton'
import Image from 'next/image'

interface Props {
	error: Error
	reset: () => void
}

export default function Error({error, reset}: Props) {
	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<section className='mx-32 flex min-h-dvh flex-col items-center justify-center gap-24 text-center'>
			<Image src='/cats/CatCry.svg' alt='Brand cat crying' width={128} height={120} className='w-128' />
			<div className='max-w-384 space-y-16'>
				<div>
					<h1 className='text-2xl font-bold'>Oops...</h1>
					<p>Something went wrong!</p>
				</div>

				<PrimaryButton onClick={() => reset()}>Try again</PrimaryButton>
			</div>
		</section>
	)
}
