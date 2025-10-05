'use client'
import PrimaryButton from '@/components/PrimaryButton'
import Image from 'next/image'
import {useRouter} from 'next/navigation'

const statusMap = {
	done: {
		image: 'CatHappy',
		emotion: 'happy',
		width: 120,
		height: 112,
		message: 'Boom! You’ve done your part for today, now go high-five yourself or pet a cat or something.',
	},
	empty: {
		image: 'CatSmile',
		emotion: 'smiling',
		width: 120,
		height: 112,
		message: 'No flashcards scheduled for today! You can add a new one now or come back another day to keep learning.',
	},
	error: {
		image: 'CatCry',
		emotion: 'crying',
		width: 120,
		height: 113,
		message: 'Oops! Something went wrong. Please try again later.',
	},
}

export default function FlashcardsStatus({status}: {status: keyof typeof statusMap}) {
	const Router = useRouter()
	return (
		<div className='flex flex-col-reverse items-center gap-24 [@media(min-width:450px)]:flex-row [@media(min-width:450px)]:justify-around [@media(min-width:450px)]:gap-0'>
			<div className='flex max-w-256 flex-col gap-24 text-center [@media(min-width:450px)]:items-start [@media(min-width:450px)]:text-left'>
				<p>{statusMap[status].message}</p>
				<PrimaryButton
					onClick={() => {
						Router.push('/home')
					}}>
					Head To Dashboard
				</PrimaryButton>
			</div>
			<Image
				src={`/cats/${statusMap[status].image}.svg`}
				alt={`Brand cat ${statusMap[status].emotion}`}
				width={statusMap[status].width}
				height={statusMap[status].height}
				priority
				className='w-128'
			/>
		</div>
	)
}
