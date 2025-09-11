'use client'
import PrimaryButton from '@/components/PrimaryButton'
import Image from 'next/image'
import {useRouter} from 'next/navigation'

export default function FlashcardsDone() {
	const Router = useRouter()
	return (
		<div className='flex flex-col-reverse items-center gap-24 [@media(min-width:450px)]:flex-row [@media(min-width:450px)]:justify-around [@media(min-width:450px)]:gap-0'>
			<div className='flex max-w-256 flex-col gap-24 text-center [@media(min-width:450px)]:items-start [@media(min-width:450px)]:text-left'>
				<p>Boom! You’ve done your part for today, now go high-five yourself or pet a cat or something.</p>
				<PrimaryButton
					onClick={() => {
						Router.push('/home')
					}}>
					Head To Dashboard
				</PrimaryButton>
			</div>
			<Image src='/cats/CatHappy.svg' alt='Brand cat smiling' width={120} height={112} priority className='w-128' />
		</div>
	)
}
