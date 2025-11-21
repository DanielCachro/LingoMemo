'use client'
import ArrayInput from '@/components/Form/ArrayInput'
import Input from '@/components/Form/Input'
import TagInput from '@/components/Form/TagInput'
import Textarea from '@/components/Form/Textarea'
import {initialFlashcardState} from '@/lib/actions/flashcards/initial'
import {lengths as inputsLengths} from '@/lib/actions/flashcards/schema'
import {FlashcardFormValues} from '@/lib/actions/flashcards/types'
import {cn} from '@/lib/utils'
import {Field, Label} from '@headlessui/react'
import {useQueryClient} from '@tanstack/react-query'
import {useRouter} from 'next/navigation'
import {useActionState, useEffect, useState, useTransition} from 'react'
import LeftAlignedModal from '../../_components/LeftAlignedModal'
import {ModalDisableAnimations} from '../../_components/Modal'
import FormBlock from './FormBlock'
import FormSection from './FormSection'

interface Props {
	title: string
	subtitle: string
	buttonContent: React.ReactNode
	pendingButtonText: string
	action: (prevState: typeof initialFlashcardState, formData: FormData) => Promise<typeof initialFlashcardState>
	initialValues?: FlashcardFormValues
	disableAnimations?: ModalDisableAnimations
}

export default function CreateEditModal({
	title,
	subtitle,
	buttonContent,
	pendingButtonText,
	action,
	initialValues,
	disableAnimations,
}: Props) {
	const [formState, formAction] = useActionState(action, initialFlashcardState)
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
			disableAnimations={disableAnimations}>
			<>
				<FormSection title='Core Details'>
					<FormBlock title='Answer (back) *'>
						<Field>
							<Label className='sr-only'>Answer (back)</Label>
							<Input
								type='text'
								name='answer'
								placeholder='Answer for the question'
								maxLength={inputsLengths.answer.max}
								defaultValue={initialValues?.answer}
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
								maxLength={inputsLengths.question.max}
								defaultValue={initialValues?.question}
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
								maxLength={inputsLengths.note.max}
								defaultValue={initialValues?.note}
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
								maxLength={inputsLengths.phonetic.max}
								defaultValue={initialValues?.phonetic}
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
								maxLength={inputsLengths.synonym.max}
								initialTags={initialValues?.synonyms}
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
								maxLength={inputsLengths.example.max}
								initialInputs={initialValues?.examples}
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
	buttonContent,
	disableAnimations,
}: {
	title: string
	subtitle: string
	buttonContent: React.ReactNode
	disableAnimations?: ModalDisableAnimations
}) {
	return (
		<LeftAlignedModal
			title={title}
			subtitleContent={subtitle}
			buttonContent={buttonContent}
			useForm={false}
			onSubmit={() => {}}
			disableAnimations={disableAnimations}>
			<div className='mt-12 animate-pulse space-y-24'>
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
						<SkeletonField />
						<SkeletonField />
					</div>
				</div>
			</div>
		</LeftAlignedModal>
	)
}
