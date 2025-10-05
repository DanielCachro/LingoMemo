'use client'
import PrimaryButton from '@/components/PrimaryButton'
import Image from 'next/image'
import {useRouter} from 'next/navigation'

const catMap = {
	done: 'CatHappy',
	empty: 'CatSmile',
	error: 'CatCry',
}

export default function FlashcardsStatus({status}: {status: 'empty' | 'done' | 'error'}) {
	const Router = useRouter()
	return (
		<div className='flex flex-col-reverse items-center gap-24 [@media(min-width:450px)]:flex-row [@media(min-width:450px)]:justify-around [@media(min-width:450px)]:gap-0'>
			<div className='flex max-w-256 flex-col gap-24 text-center [@media(min-width:450px)]:items-start [@media(min-width:450px)]:text-left'>
				{status === 'empty' && (
					<p>No flashcards scheduled for today! You can add a new one now or come back another day to keep learning.</p>
				)}
				{status === 'done' && (
					<p>Boom! You’ve done your part for today, now go high-five yourself or pet a cat or something.</p>
				)}
				{status === 'error' && <p>Oops! Something went wrong. Please try again later.</p>}
				<PrimaryButton
					onClick={() => {
						Router.push('/home')
					}}>
					Head To Dashboard
				</PrimaryButton>
			</div>
			<Image
				src={`/cats/${catMap[status]}.svg`}
				alt={`Brand cat ${status === 'done' ? 'smiling' : 'crying'}`}
				width={120}
				height={112}
				priority
				className='w-128'
			/>
		</div>
	)
}
