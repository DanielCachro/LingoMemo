import AudioIcon from '@/components/AudioIcon'
import AudioPlayback from '@/components/AudioPlayback'
import {cn} from '@/lib/utils/cn'
import {Flashcard} from '@/types/study'
import Link from 'next/link'
import {Fragment} from 'react'
import type {UserAnswer} from './StudyClient'

function HighlightIncorrectElements({
	userAnswer,
	correctAnswer,
	caseSensitive = true,
	className = 'text-error-400',
}: {
	userAnswer: string
	correctAnswer: string
	caseSensitive?: boolean
	className: string
}) {
	const userAnswerLength = userAnswer.length
	const correctAnswerLength = correctAnswer.length
	const shorterLength = Math.min(userAnswerLength, correctAnswerLength)

	// check in which indexes userAnswer and correctAnswer differ
	const diffIndexes: number[] = []
	for (let i = 0; i < shorterLength; i++) {
		if (caseSensitive) {
			if (userAnswer.charAt(i) !== correctAnswer.charAt(i)) diffIndexes.push(i)
		} else {
			if (userAnswer.charAt(i).toLowerCase() !== correctAnswer.charAt(i).toLowerCase()) diffIndexes.push(i)
		}
	}
	// create a mask of length userAnswerLength, where true means that the character at that index should be highlighted
	const mask = new Array(userAnswerLength).fill(false)
	diffIndexes.forEach(index => {
		if (index >= 0 && index < mask.length) mask[index] = true
	})
	// if userAnswer is longer than correctAnswer, we highlight the rest of the characters
	if (userAnswerLength > correctAnswerLength) mask.fill(true, correctAnswerLength)
	// create parts from the mask, where each part is an object with text and highlight properties
	// we create parts by iterating through the mask and grouping consecutive characters with the same highlight value
	// for example, if the mask is [false, false, true, true, false], we create three parts
	const parts: Array<{text: string; highlight: boolean}> = []
	let start = 0
	while (start < userAnswerLength) {
		const active = mask[start]
		let end = start + 1
		// find the next index where the mask value changes
		while (end < userAnswerLength && mask[end] === active) end++
		const slice = userAnswer.slice(start, end)
		parts.push({text: slice, highlight: active})
		start = end
	}

	return (
		<>
			{parts.map((part, index) =>
				part.highlight ? (
					<span key={`${part.text}-${index}`} className={className}>
						{part.text}
					</span>
				) : (
					<Fragment key={`${part.text}-${index}`}>{part.text}</Fragment>
				),
			)}
		</>
	)
}

export default function AnswerDisplay({
	answer,
	examples,
	synonyms,
	userAnswer,
}: {
	answer: Flashcard['answer']
	examples: Flashcard['examples']
	synonyms: Flashcard['synonyms']
	userAnswer: UserAnswer
}) {
	return (
		<div
			className={cn(
				'max-h-384 w-full space-y-16 overflow-y-auto rounded-sm border-2 bg-primary-500 p-24 text-primary-50 dark:bg-primary-600 dark:text-primary-100',
				{
					'border-success-300 bg-success-200 text-success-900 dark:border-success-700 dark:bg-success-800 dark:text-success-50':
						userAnswer.isCorrect,
					'border-error-300 bg-error-200 text-error-800 dark:border-error-700 dark:bg-error-800 dark:text-error-200':
						!userAnswer.isCorrect,
				},
			)}>
			<AudioPlayback audio={answer.audio[0]} />

			<div className='flex flex-col gap-8 font-bold'>
				{userAnswer.answer && (
					<div className='w-full wrap-break-word'>
						<HighlightIncorrectElements
							userAnswer={userAnswer.answer}
							correctAnswer={answer.text}
							caseSensitive={false}
							className='text-error-400 dark:text-error-400'
						/>
					</div>
				)}

				<div className='mb-8 flex flex-wrap items-start gap-x-16 gap-y-4'>
					<p className='min-w-0 wrap-break-word'>
						<span>{answer.text}</span>
						{answer.audio && answer.audio.length > 0 && (
							<span className='ml-8 inline-flex flex-wrap gap-4 align-middle'>
								{answer.audio.map((audio, index) => (
									<AudioIcon key={`${answer.text}-audio-${index}`} audio={audio} />
								))}
							</span>
						)}
					</p>

					<p className='font-medium break-all whitespace-pre-wrap'>{answer.phonetic}</p>
				</div>
			</div>

			{examples && examples.length > 0 && (
				<div className='space-y-4'>
					<p className='font-bold'>Examples</p>
					<ol className='ml-24 list-disc space-y-4 wrap-break-word'>
						{examples.map((example, index) => (
							<li className='w-full' key={`${answer.text}-${example.slice(-6, -1).trim()}-${index}`}>
								<span className='inline'>{example}</span>
							</li>
						))}
					</ol>
				</div>
			)}

			{synonyms && synonyms.length > 0 && (
				<div className='space-y-4'>
					<p className='font-bold'>Synonyms</p>
					{synonyms.map((synonym, index) => (
						<span
							key={`${synonym.slice(0, 10).trim()}-${index}`}
							className='inline-block text-primary-500 dark:text-primary-600'>
							<Link href={`dictionary?search=${synonym}`} className='wrap-break-word break-all hover:underline'>
								{synonym}
							</Link>
							{index < synonyms.length - 1 && <span className='mr-[3px]'>,</span>}
						</span>
					))}
				</div>
			)}
		</div>
	)
}
