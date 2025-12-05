'use client'
import PrimaryButton from '@/components/PrimaryButton'
import {cn} from '@/lib/utils'
import Image from 'next/image'
import {useRouter} from 'next/navigation'

const statusMap = {
	done: {
		image: 'CatHappy',
		emotion: 'happy',
		width: 120,
		height: 112,
		message: 'No more cards left for today. You crushed it!',
	},
	empty: {
		image: 'CatSmile',
		emotion: 'smiling',
		width: 120,
		height: 112,
		message: 'No flashcards scheduled for today! You can add a new one now or come back another day.',
	},
}
export default function StudyStatus({status}: {status: keyof typeof statusMap}) {
	const router = useRouter()
	return (
		<div
			className={cn(
				'mx-24 flex h-fit flex-wrap-reverse items-center justify-center gap-16 rounded-sm border-2 border-background-200 p-16 text-center dark:border-background-700 [@media(min-width:320px)]:p-32 [@media(min-width:452px)]:text-left',
				{
					'sm:gap-16': status === 'done',
					'sm:gap-32': status === 'empty',
				},
			)}>
			<div className='w-192 space-y-24'>
				<p>{statusMap[status].message}</p>
				{status === 'empty' && (
					<PrimaryButton onClick={() => router.push('/flashcards')}>Head To Flashcards!</PrimaryButton>
				)}
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
