'use client'
import PrimaryButton from '@/components/PrimaryButton'
import SecondaryButton from '@/components/SecondaryButton'
import {cn} from '@/lib/utils/cn'
import {FlashcardResponseQuality} from '@/types/study'
import {useCallback, useEffect, useState} from 'react'
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
	const [pressed, setPressed] = useState({
		hint: false,
		check: false,
		rate0: false,
		rate3: false,
		rate5: false,
	})

	const triggerPress = useCallback((button: keyof typeof pressed) => {
		setPressed(prev => ({...prev, [button]: true}))
		setTimeout(() => setPressed(prev => ({...prev, [button]: false})), 100)
	}, [])

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (props.mode === 'checkAnswer') {
				if (e.key === 'Enter') {
					props.handleCheckAnswer()
					triggerPress('check')
					e.preventDefault()
				}
				if (e.key.toLowerCase() === '[') {
					props.handleGiveHint()
					triggerPress('hint')
					e.preventDefault()
				}
			}
			if (props.mode === 'rateAnswer') {
				if (e.key === '1') {
					props.handleRateAnswer(0)
					triggerPress('rate0')
					e.preventDefault()
				}
				if (e.key === '2') {
					props.handleRateAnswer(3)
					triggerPress('rate3')
					e.preventDefault()
				}
				if (e.key === '3') {
					props.handleRateAnswer(5)
					triggerPress('rate5')
					e.preventDefault()
				}
			}
		},
		[props, triggerPress],
	)

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [handleKeyDown])

	const liClasses =
		'flex flex-col items-end gap-12  text-background-400 dark:text-background-600 [&>span]:hidden [&>span]:text-xs [&>span]:pointer-fine:inline  '

	return (
		<div className='flex items-center justify-center border-t-2 border-background-200 bg-background-100 py-16 dark:border-background-800 dark:bg-background-900 pointer-fine:pt-16 pointer-fine:pb-8'>
			<menu className='flex gap-24'>
				{props.mode === 'checkAnswer' && (
					<>
						<li className={liClasses}>
							<SecondaryButton className='px-32 py-[0.375rem]' onClick={props.handleGiveHint} pressed={pressed.hint}>
								Hint
							</SecondaryButton>
							<span>Key [</span>
						</li>
						<li className={liClasses}>
							<PrimaryButton className='px-32 py-8' onClick={props.handleCheckAnswer} pressed={pressed.check}>
								Check
							</PrimaryButton>
							<span>Enter</span>
						</li>
					</>
				)}
				{props.mode === 'rateAnswer' && (
					<>
						<li className={liClasses}>
							<RateButton
								variant={!props.userAnswer.isCorrect ? 'primary' : 'secondary'}
								pressed={pressed.rate0}
								onClick={() => props.handleRateAnswer(0)}>
								Bad
							</RateButton>
							<span>Key 1</span>
						</li>
						<li className={liClasses}>
							<RateButton
								variant={props.userAnswer.isCorrect && props.userAnswer.hintCount > 0 ? 'primary' : 'secondary'}
								pressed={pressed.rate3}
								onClick={() => props.handleRateAnswer(3)}>
								Good
							</RateButton>
							<span>Key 2</span>
						</li>
						<li className={liClasses}>
							<RateButton
								variant={props.userAnswer.isCorrect && props.userAnswer.hintCount === 0 ? 'primary' : 'secondary'}
								pressed={pressed.rate5}
								onClick={() => props.handleRateAnswer(5)}>
								Easy
							</RateButton>
							<span>Key 3</span>
						</li>
					</>
				)}
			</menu>
		</div>
	)
}
