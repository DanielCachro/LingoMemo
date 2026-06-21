'use client'

import Spinner from '@/components/Spinner'
import {$Enums} from '@/lib/generated/prisma/browser'
import {faCircleExclamation, faCirclePlus, faMinusCircle} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useEffect, useState, useTransition} from 'react'
import {createFlashcard, deleteFlashcard} from '../_lib/actions'
import type {DictionaryDefinition} from '../_lib/types'
import {useEntry} from './EntryProvider'

type Props = {
	flashcardId: number | null
	definition: DictionaryDefinition
	userTargetLang?: $Enums.TargetLanguages | null
}

export function FlashcardButtons({flashcardId, definition, userTargetLang}: Props) {
	const entry = useEntry()

	const [isPending, startTransition] = useTransition()
	const [error, setError] = useState<string | null>(null)
	const [flashcardExists, setFlashcardExists] = useState(flashcardId ? true : false)
	const [screenReaderMessage, setScreenReaderMessage] = useState<string>('')

	// Clear screen reader message after 3 seconds to prevent it from being focusable by screen readers after aria-live region announcement
	useEffect(() => {
		if (screenReaderMessage) {
			const timer = setTimeout(() => {
				setScreenReaderMessage('')
			}, 5000)
			return () => clearTimeout(timer)
		}
	}, [screenReaderMessage])

	if (!userTargetLang || userTargetLang !== entry.entryLang) {
		return null
	}

	const handleCreate = async () => {
		if (isPending) return

		setError(null)
		setScreenReaderMessage('')

		startTransition(async () => {
			try {
				await createFlashcard({
					answer: entry.word,
					question: definition.definition,
					audio: entry.audio,
					examples: definition.examples,
					phonetic: entry.phonetic,
					synonyms: definition.synonyms,
					license: {
						name: entry.source.license.name,
						licenseUrl: entry.source.license.url,
						sourceUrl: entry.source.url,
					},
				})
				setFlashcardExists(true)
				setScreenReaderMessage('Flashcard created successfully')
			} catch (error) {
				setError((error as Error).message)
				setFlashcardExists(false)
			}
		})
	}

	const handleDelete = async () => {
		if (isPending || !flashcardId) return

		setError(null)
		setScreenReaderMessage('')

		startTransition(async () => {
			try {
				await deleteFlashcard(flashcardId)
				setFlashcardExists(false)
				setScreenReaderMessage('Flashcard deleted successfully')
			} catch (error) {
				setError((error as Error).message)
				setFlashcardExists(true)
			}
		})
	}

	const buttonClasses = `inline-flex items-center justify-center w-4 h-4 text-primary-500 hover:text-primary-600 dark:text-primary-600 dark:hover:text-primary-700 ${
		isPending ? ' cursor-not-allowed pointer-events-none' : 'hover:cursor-pointer'
	}`

	return (
		<>
			<span role='status' className='sr-only'>
				{screenReaderMessage}
			</span>

			<span className='mx-8 inline-flex h-4 w-4 translate-y-[0.125rem] items-center justify-center'>
				<button
					onClick={!flashcardExists ? handleCreate : handleDelete}
					className={buttonClasses}
					aria-label={
						!flashcardExists
							? 'Create flashcard from this definition'
							: 'Delete flashcard associated with this definition'
					}>
					{isPending ? (
						<Spinner height={16} width={16} />
					) : !flashcardExists ? (
						<FontAwesomeIcon icon={faCirclePlus} />
					) : (
						<FontAwesomeIcon icon={faMinusCircle} />
					)}
				</button>
			</span>

			{error && (
				<span role='alert' className='ml-4 text-sm text-error-500 dark:text-error-600'>
					<FontAwesomeIcon icon={faCircleExclamation} className='mr-4' />
					{error}
				</span>
			)}
		</>
	)
}
