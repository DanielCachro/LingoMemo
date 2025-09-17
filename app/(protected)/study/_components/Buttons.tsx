'use client'
import PrimaryButton from '@/components/PrimaryButton'
import SecondaryButton from '@/components/SecondaryButton'
import {cn} from '@/lib/utils'
import {FlashcardResponseQuality} from '@/types/study'
import {UserAnswer} from './StudyClient'

interface CheckAnswerProps {
	mode: 'checkAnswer'
	handleCheckAnswer: () => void
	handleGiveHint: () => void
}

interface RateAnswerProps {
	mode: 'rateAnswer'
	userAnswer: UserAnswer
	handleRateAnswer: (quality: FlashcardResponseQuality) => void
}

type RateButtonProps = {
	variant: 'primary' | 'secondary'
} & React.ComponentPropsWithoutRef<typeof PrimaryButton>

function RateButton({variant, ...props}: RateButtonProps) {
	const Component = variant === 'primary' ? PrimaryButton : SecondaryButton
	const classes =
		variant === 'primary' ? 'py-8 [@media(min-width:360px)]:px-32' : 'py-[0.375rem] [@media(min-width:360px)]:px-32'

	return <Component {...props} className={cn(classes, props.className)} />
}

export default function Buttons(props: CheckAnswerProps | RateAnswerProps) {
	return (
		<div className='flex items-center justify-center border-t-2 border-background-200 bg-background-100 py-16 dark:border-background-800 dark:bg-background-900'>
			<menu className='flex gap-24'>
				{props.mode === 'checkAnswer' && (
					<>
						<li>
							<SecondaryButton className='px-32 py-[0.375rem]' onClick={props.handleGiveHint}>
								Hint
							</SecondaryButton>
						</li>
						<li>
							<PrimaryButton className='px-32 py-8' onClick={props.handleCheckAnswer}>
								Check
							</PrimaryButton>
						</li>
					</>
				)}
				{props.mode === 'rateAnswer' && (
					<>
						<li>
							<RateButton
								variant={!props.userAnswer.isCorrect ? 'primary' : 'secondary'}
								onClick={() => props.handleRateAnswer(0)}>
								Bad
							</RateButton>
						</li>
						<li>
							<RateButton
								variant={props.userAnswer.isCorrect && props.userAnswer.hintCount > 0 ? 'primary' : 'secondary'}
								onClick={() => props.handleRateAnswer(3)}>
								Good
							</RateButton>
						</li>
						<li>
							<RateButton
								variant={props.userAnswer.isCorrect && props.userAnswer.hintCount === 0 ? 'primary' : 'secondary'}
								onClick={() => props.handleRateAnswer(5)}>
								Easy
							</RateButton>
						</li>
					</>
				)}
			</menu>
		</div>
	)
}
