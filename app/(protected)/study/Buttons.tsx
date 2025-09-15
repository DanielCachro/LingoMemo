'use client'
import PrimaryButton from '@/components/PrimaryButton'
import SecondaryButton from '@/components/SecondaryButton'
import {FlashcardResponseQuality} from '@/types/study'

export default function Buttons({handleAnswerFn}: {handleAnswerFn: (quality: FlashcardResponseQuality) => void}) {
	return (
		<div className='flex items-center justify-center border-t-2 border-background-200 bg-background-100 py-16 dark:border-background-800 dark:bg-background-900'>
			<menu className='flex gap-24'>
				{false && (
					<>
						<li>
							<SecondaryButton className='px-32 py-[0.375rem]'>Back</SecondaryButton>
						</li>
						<li>
							<PrimaryButton className='px-32 py-8'>Check</PrimaryButton>
						</li>
					</>
				)}
				{true && (
					<>
						<li>
							<SecondaryButton className='py-[0.375rem] [@media(min-width:360px)]:px-32' onClick={() => handleAnswerFn(0)}>
								Bad
							</SecondaryButton>
						</li>
						<li>
							<PrimaryButton className='py-8 [@media(min-width:360px)]:px-32' onClick={() => handleAnswerFn(3)}>
								Good
							</PrimaryButton>
						</li>
						<li>
							<SecondaryButton className='py-[0.375rem] [@media(min-width:360px)]:px-32' onClick={() => handleAnswerFn(5)}>
								Easy
							</SecondaryButton>
						</li>
					</>
				)}
			</menu>
		</div>
	)
}
