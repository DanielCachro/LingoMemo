'use client'
import ArrayInput from '@/components/Form/ArrayInput'
import Input from '@/components/Form/Input'
import TagInput from '@/components/Form/TagInput'
import Textarea from '@/components/Form/Textarea'
import {initialFlashcardState} from '@/lib/actions/flashcards/initial'
import {createFlashcard} from '@/lib/actions/flashcards/manage'
import {Field, Label} from '@headlessui/react'
import {useQueryClient} from '@tanstack/react-query'
import {useRouter} from 'next/navigation'
import {useActionState, useEffect, useState, useTransition} from 'react'
import FormBlock from '../_components/FormBlock'
import FormSection from '../_components/FormSection'
import ModalWrapper from '../_components/ModalWrapper'

export default function FlashcardsCreateModal() {
	const [formState, formAction] = useActionState(createFlashcard, initialFlashcardState)
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [formErrors, setFormErrors] = useState(initialFlashcardState.errors)
	const queryClient = useQueryClient()

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		startTransition(() => {
			formAction(formData)
		})
	}

	useEffect(() => {
		if (formState.status === 'success') {
			// TODO: show toast notification
			queryClient.invalidateQueries({queryKey: ['flashcards']})
			router.back()
		}

		if (formState.status === 'error') {
			// TODO: show toast notification
			setFormErrors(formState.errors)
		}
	}, [formState, router, queryClient])

	return (
		<ModalWrapper
			title='Create Flashcard'
			subtitleContent={
				formState.errors && formState.message ? (
					<p className='text-error-500'>{formState.message}</p>
				) : (
					<p>Fill in the details to create a flashcard.</p>
				)
			}
			buttonContent={isPending ? <span className='animate-pulse'>Creating...</span> : 'Create Flashcard'}
			useForm={true}
			onSubmit={handleSubmit}>
			<>
				<FormSection title='Core Details'>
					<FormBlock title='Answer (back) *'>
						<Field>
							<Label className='sr-only'>Answer (back)</Label>
							<Input
								type='text'
								name='answer'
								placeholder='Answer for the question'
								error={!!formErrors.answer}
								errorMessage={formErrors.answer}
								onChange={() => {
									setFormErrors(prev => ({
										...prev,
										answer: undefined,
									}))
								}}
							/>
						</Field>
					</FormBlock>
					<FormBlock title='Question (front) *'>
						<Field>
							<Label className='sr-only'>Question (front)</Label>
							<Input
								type='text'
								name='question'
								placeholder='Question on the front side'
								error={!!formErrors.question}
								errorMessage={formErrors.question}
								onChange={() => {
									setFormErrors(prev => ({
										...prev,
										question: undefined,
									}))
								}}
							/>
						</Field>
					</FormBlock>
					<FormBlock title='Note'>
						<Field>
							<Label className='sr-only'>Note</Label>
							<Textarea
								className='max-h-192'
								name='note'
								placeholder='Any additional notes or context'
								error={!!formErrors.note}
								errorMessage={formErrors.note}
								onChange={() => {
									setFormErrors(prev => ({
										...prev,
										note: undefined,
									}))
								}}
							/>
						</Field>
					</FormBlock>
				</FormSection>
				<FormSection title='Vocabulary Related'>
					<FormBlock title='Phonetic'>
						<Field>
							<Label className='sr-only'>Phonetic</Label>
							<Input
								type='text'
								name='phonetic'
								placeholder='e.g., /həˈləʊ/'
								error={!!formErrors.phonetic}
								errorMessage={formErrors.phonetic}
								onChange={() => {
									setFormErrors(prev => ({
										...prev,
										phonetic: undefined,
									}))
								}}
							/>
						</Field>
					</FormBlock>
					<FormBlock title='Synonyms'>
						<Field>
							<Label className='sr-only'>Synonyms</Label>
							<TagInput
								name='synonyms'
								errorInTag={formErrors.synonyms}
								onTagRemove={tagIndex => {
									setFormErrors(prev => ({
										...prev,
										synonyms: prev.synonyms
											?.filter(error => error.index !== tagIndex)
											.map(error => ({
												...error,
												index: error.index > tagIndex ? error.index - 1 : error.index,
											})),
									}))
								}}
							/>
						</Field>
					</FormBlock>
					<FormBlock title='Examples'>
						<Field>
							<Label className='sr-only'>Examples</Label>
							<ArrayInput
								name='examples'
								buttonContent='Add New Example'
								errorInInput={formErrors.examples}
								onInputChange={inputIndex => {
									setFormErrors(prev => ({
										...prev,
										examples: prev.examples?.filter(error => error.index !== inputIndex),
									}))
								}}
								onInputRemove={inputIndex => {
									setFormErrors(prev => ({
										...prev,
										examples: prev.examples
											?.filter(error => error.index !== inputIndex)
											.map(error => ({
												...error,
												index: error.index > inputIndex ? error.index - 1 : error.index,
											})),
									}))
								}}
							/>
						</Field>
					</FormBlock>
				</FormSection>
			</>
		</ModalWrapper>
	)
}
