'use client'
import type {Flashcard} from '@/types/study'

export default function Flashcard({flashcard}: {flashcard: Flashcard}) {
	// const buttonStyle = 'hover:cursor-pointer'

	return (
		<div className='flex aspect-4/3 flex-col items-center rounded-sm bg-primary-500 px-32 text-primary-50 shadow-slab-primary-300 dark:bg-primary-600 dark:text-primary-100'>
			{/* <div className='space-x-8 self-end pt-16'>
				<button className={buttonStyle}>
					<FontAwesomeIcon size='sm' icon={faMinusCircle} />
				</button>
				<button className={buttonStyle}>
					<FontAwesomeIcon size='sm' icon={faMessage} />
				</button>
			</div> */}
			<div className='flex w-full max-w-384 grow flex-col items-center justify-center gap-24 pt-24 pb-48 text-center'>
				<p className='w-full wrap-break-word'>{flashcard.question}</p>
				<p className='max-h-128 w-full justify-self-center overflow-y-auto rounded-sm bg-primary-400 px-24 py-16 text-sm wrap-break-word text-primary-300 dark:bg-primary-500'>
					{flashcard.note || 'No comments yet.'}
				</p>
			</div>
		</div>
	)
}

export function Skeleton() {
	return (
		<div
			role='status'
			className='flex aspect-4/3 animate-pulse flex-col items-center rounded-sm bg-skeleton px-32 dark:text-primary-100'>
			<div className='flex w-full max-w-384 grow flex-col items-center justify-center gap-24 pt-32 pb-48'>
				<div className='w-full space-y-8'>
					<div className='h-8 w-11/12 rounded-full bg-skeleton-accent'></div>
					<div className='h-8 rounded-full bg-skeleton-accent'></div>
					<div className='h-8 w-9/12 rounded-full bg-skeleton-accent'></div>
				</div>
				<div className='h-48 w-full justify-self-center overflow-auto rounded-sm bg-skeleton-accent px-24 py-16'></div>
			</div>
		</div>
	)
}
