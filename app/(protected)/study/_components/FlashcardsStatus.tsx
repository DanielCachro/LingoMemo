'use client'
import PrimaryButton from '@/components/PrimaryButton'
import Image from 'next/image'
import {useRouter} from 'next/navigation'

export default function FlashcardsStatus({status}: {status: 'done' | 'error'}) {
	const Router = useRouter()
	return (
		<div className='flex flex-col-reverse items-center gap-24 [@media(min-width:450px)]:flex-row [@media(min-width:450px)]:justify-around [@media(min-width:450px)]:gap-0'>
			<div className='flex max-w-256 flex-col gap-24 text-center [@media(min-width:450px)]:items-start [@media(min-width:450px)]:text-left'>
				{status === 'done' ? (
					<p>Boom! You’ve done your part for today, now go high-five yourself or pet a cat or something.</p>
				) : (
					<p>Oops! Something went wrong. Please try again later.</p>
				)}
				<PrimaryButton
					onClick={() => {
						Router.push('/home')
					}}>
					Head To Dashboard
				</PrimaryButton>
			</div>
			<Image
				src={`/cats/${status === 'done' ? 'CatHappy' : 'CatCry'}.svg`}
				alt={`Brand cat ${status === 'done' ? 'smiling' : 'crying'}`}
				width={120}
				height={112}
				priority
				className='w-128'
			/>
		</div>
	)
}
