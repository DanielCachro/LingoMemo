'use client'

import {faCircleExclamation, faCirclePlus, faMinusCircle, faSpinner} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {$Enums} from '@prisma/client'
import {useState, useTransition} from 'react'
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

	if (!userTargetLang || userTargetLang !== entry.entryLang) {
		return null
	}

	const handleCreate = async () => {
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
				// Optimistic update - we assume success
				// `revalidatePath` in the server action will retrieve the real data anyway
				setFlashcardExists(true)
			} catch (error) {
				setError((error as Error).message)
				setFlashcardExists(false) // Return to the initial state in case of an error.
			}
		})
	}

	const handleDelete = async () => {
		if (!flashcardId) return
		setError(null)

		startTransition(async () => {
			try {
				await deleteFlashcard(flashcardId)
				setFlashcardExists(false)
			} catch (error) {
				setError((error as Error).message)
				setFlashcardExists(true)
			}
		})
	}

	if (isPending) {
		return <FontAwesomeIcon size='sm' icon={faSpinner} pulse className='text-background-500 dark:text-background-400' />
	}

	const buttonClasses =
		'text-primary-500 hover:cursor-pointer hover:text-primary-600 dark:text-primary-600 dark:hover:text-primary-700'

	return (
		<>
			{!flashcardExists ? (
				<button onClick={handleCreate} className={buttonClasses}>
					<FontAwesomeIcon icon={faCirclePlus} />
				</button>
			) : (
				<button onClick={handleDelete} className={buttonClasses}>
					<FontAwesomeIcon icon={faMinusCircle} />
				</button>
			)}
			{error && (
				<span className='text-sm text-error-500 dark:text-error-600'>
					<FontAwesomeIcon icon={faCircleExclamation} className='mr-4' />
					{error}
				</span>
			)}
		</>
	)
}
