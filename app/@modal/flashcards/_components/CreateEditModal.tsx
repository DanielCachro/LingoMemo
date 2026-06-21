'use client'
import ArrayInput from '@/components/Form/ArrayInput'
import Input from '@/components/Form/Input'
import TagInput from '@/components/Form/TagInput'
import Textarea from '@/components/Form/Textarea'
import initialFlashcardState from '@/lib/flashcards/initialFlashcardState'
import {flashcardFieldsLimits} from '@/lib/flashcards/schema'
import {cn} from '@/lib/utils/cn'
import {FlashcardFormValues} from '@/types/flashcards'
import {Field, Label} from '@headlessui/react'
import {useQueryClient} from '@tanstack/react-query'
import _ from 'lodash'
import {useRouter} from 'next/navigation'
import {useActionState, useEffect, useRef, useState, useTransition} from 'react'
import {toast} from 'react-toastify'
import LeftAlignedModal from '../../_components/LeftAlignedModal'
import {ModalDisableAnimations, ModalSkeleton} from '../../_components/Modal'
import FormBlock from './FormBlock'
import FormSection from './FormSection'

interface Props {
	title: string
	subtitle: string
	buttonContent: React.ReactNode
	pendingButtonText: string
	successMessage?: string
	errorMessage?: string
	action: (prevState: typeof initialFlashcardState, formData: FormData) => Promise<typeof initialFlashcardState>
	initialValues?: FlashcardFormValues
	disableAnimations?: ModalDisableAnimations
}

export default function CreateEditModal({
	title,
	subtitle,
	buttonContent,
	pendingButtonText,
	successMessage = 'Flashcard saved successfully!',
	errorMessage = 'Failed to save flashcard. Please try again.',
	action,
	initialValues,
	disableAnimations,
}: Props) {
	const [formState, formAction] = useActionState(action, {...initialFlashcardState, data: initialValues})
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [formErrors, setFormErrors] = useState(initialFlashcardState.errors)
	const queryClient = useQueryClient()
	const modalCloseRef = useRef<(() => void) | null>(null)

	const [screenReaderMessage, setScreenReaderMessage] = useState('')
	const srTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		startTransition(() => {
			formAction(formData)
		})
	}

	useEffect(() => {
		if (formState.status === 'success') {
			toast.success(successMessage)
			queryClient.invalidateQueries({queryKey: ['flashcards']})

			if (modalCloseRef.current) {
				modalCloseRef.current()
			} else {
				router.back()
			}
		}

		if (formState.status === 'error') {
			setFormErrors(formState.errors)

			const message =
				formState.message ||
				(_.isEmpty(formState.errors) ? errorMessage : 'Please fix the errors in the form and try again.')

			if (_.isEmpty(formState.errors)) {
				toast.error(message)
			}

			if (srTimerRef.current) clearTimeout(srTimerRef.current)
			setScreenReaderMessage('')
			srTimerRef.current = setTimeout(() => setScreenReaderMessage(message), 50)
		}
	}, [formState, router, queryClient, successMessage, errorMessage])

	useEffect(() => {
		if (screenReaderMessage) {
			const timer = setTimeout(() => {
				setScreenReaderMessage('')
			}, 5000)
			return () => clearTimeout(timer)
		}
	}, [screenReaderMessage])

	useEffect(() => {
		return () => {
			router.refresh() // Refresh the page when the modal is closed to ensure state resets properly. This is a workaround for the issue with form state not resetting after closing modal due to Next.js using React Activity on client navigation to hide components instead of unmounting them.

			// We are doing it to fix the issue with state not resetting after closing modal.
			// This happens because client navigation in Next.js use React Activity to hide components instead of unmounting the
			formState.status = initialFlashcardState.status
			formState.message = initialFlashcardState.message
			formState.errors = initialFlashcardState.errors
			setFormErrors(initialFlashcardState.errors)

			setScreenReaderMessage('')
			if (srTimerRef.current) clearTimeout(srTimerRef.current)
		}
	}, [router, formState])

	return (
		<LeftAlignedModal
			title={title}
			subtitleContent={
				formState.errors && formState.message ? (
					<p className='text-error-500'>{formState.message}</p>
				) : (
					<p>{subtitle}</p>
				)
			}
			buttonContent={isPending ? <span className='animate-pulse'>{pendingButtonText}</span> : buttonContent}
			useForm={true}
			onSubmit={handleSubmit}
			disableAnimations={disableAnimations}
			modalCloseRef={modalCloseRef}>
			<>
				<FormSection title='Core Details'>
					<FormBlock title='Answer (back) *'>
						<Field>
							<Label className='hidden'>Answer (back)</Label>
							<Input
								type='text'
								name='answer'
								placeholder='Answer for the question'
								maxLength={flashcardFieldsLimits.answer.max}
								defaultValue={formState?.data?.answer}
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
							<Label className='hidden'>Question (front)</Label>
							<Input
								type='text'
								name='question'
								placeholder='Question on the front side'
								maxLength={flashcardFieldsLimits.question.max}
								defaultValue={formState?.data?.question}
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
							<Label className='hidden'>Note</Label>
							<Textarea
								className='max-h-192'
								name='note'
								placeholder='Any additional notes or context'
								maxLength={flashcardFieldsLimits.note.max}
								defaultValue={formState?.data?.note}
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
							<Label className='hidden'>Phonetic</Label>
							<Input
								type='text'
								name='phonetic'
								placeholder='e.g., /həˈləʊ/'
								maxLength={flashcardFieldsLimits.phonetic.max}
								defaultValue={formState?.data?.phonetic}
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
							<Label className='hidden'>Synonyms</Label>
							<TagInput
								name='synonyms'
								maxLength={flashcardFieldsLimits.synonym.max}
								initialTags={formState?.data?.synonyms}
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
							<Label className='hidden'>Examples</Label>
							<ArrayInput
								name='examples'
								buttonContent='Add New Example'
								maxLength={flashcardFieldsLimits.example.max}
								initialInputs={formState?.data?.examples}
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
				{screenReaderMessage && (
					<div role='alert' className='sr-only'>
						{screenReaderMessage}
					</div>
				)}
			</>
		</LeftAlignedModal>
	)
}

function SkeletonTextLine() {
	return (
		<div className='flex h-24 items-center'>
			<div className='h-16 w-192 rounded-full bg-skeleton' />
		</div>
	)
}

function SkeletonField({type = 'input'}: {type?: 'input' | 'textarea'}) {
	return (
		<div
			className={cn('rounded-sm bg-skeleton', {
				'h-[3.75rem]': type === 'input',
				'h-[5.25rem]': type === 'textarea',
			})}
		/>
	)
}

export function Skeleton({
	title,
	subtitle,
	disableAnimations,
}: {
	title: string
	subtitle: string
	disableAnimations?: ModalDisableAnimations
}) {
	return (
		<ModalSkeleton
			mobileScreenCoverage='9/10' // LeftAlignedModal uses 9/10 by default
			disableAnimations={disableAnimations}
			className='overflow-hidden'>
			<div className='flex h-full flex-col justify-between space-y-16 p-16 pt-0'>
				<div className='flex min-h-0 w-full min-w-0 flex-col space-y-24'>
					<div className='flex justify-between sm:mt-16'>
						<div>
							<h2 className='text-xl font-bold'>{title}</h2>
							<p>{subtitle}</p>
						</div>
					</div>

					<div className='-mr-16 flex h-full min-h-0 animate-pulse flex-col justify-start space-y-24 overflow-y-auto pr-16'>
						<div className='space-y-16'>
							<SkeletonTextLine />
							<div className='space-y-12'>
								<SkeletonTextLine />
								<SkeletonField />
							</div>
							<div className='space-y-12'>
								<SkeletonTextLine />
								<SkeletonField />
							</div>
							<div className='space-y-12'>
								<SkeletonTextLine />
								<SkeletonField type='textarea' />
							</div>
						</div>
					</div>
				</div>
				<div className='h-48 w-full shrink-0 animate-pulse rounded-md bg-skeleton opacity-50' />
			</div>
		</ModalSkeleton>
	)
}
