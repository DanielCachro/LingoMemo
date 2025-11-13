'use client'
import {useModalData} from '@/app/ModalDataProvider'
import Checkbox from '@/components/Form/Chceckbox'
import Input from '@/components/Form/Input'
import {Field, Fieldset, Label, Legend} from '@headlessui/react'
import {useState} from 'react'
import z from 'zod'
import FormBlock from '../_components/FormBlock'
import ModalWrapper from '../_components/ModalWrapper'
import {initialFlashcardsFilter} from './initial'
import {FlashcardsFilter, schema} from './schema'

function ErrorMessage({error}: {error?: string[]}) {
	if (!error?.length) return null
	return <p className='mt-8 text-sm text-error-500'>{error[0]}</p>
}

export default function FlashcardsFilterModal() {
	const {setData, getData} = useModalData()
	const [savedFilter, setSavedFilter] = useState<FlashcardsFilter>(
		getData<FlashcardsFilter>('flashcardsFilter') || initialFlashcardsFilter,
	)
	const [errors, setErrors] = useState<Record<string, string[]>>({})

	function handleSubmit(event: React.FormEvent<HTMLFormElement>, closeModal: () => void) {
		event.preventDefault()

		const formData = new FormData(event.currentTarget)

		const data = {
			hasNote: formData.get('hasNote') === 'on' ? true : false,
			createdAtFrom: formData.get('createdAtFrom') || undefined,
			createdAtTo: formData.get('createdAtTo') || undefined,
			nextReviewDateFrom: formData.get('nextReviewDateFrom') || undefined,
			nextReviewDateTo: formData.get('nextReviewDateTo') || undefined,
			efactorFrom: formData.get('efactorFrom') ? Number(formData.get('efactorFrom')) : undefined,
			efactorTo: formData.get('efactorTo') ? Number(formData.get('efactorTo')) : undefined,
		}

		const parsedData = schema.safeParse(data)

		if (!parsedData.success) {
			setErrors(z.flattenError(parsedData.error).fieldErrors)
			return
		}

		setData<FlashcardsFilter>('flashcardsFilter', parsedData.data)
		closeModal()
	}

	function handleReset() {
		setSavedFilter({})
	}

	return (
		<ModalWrapper
			title='Filter'
			buttonContent='Apply Filters'
			onReset={handleReset}
			onSubmit={handleSubmit}
			useForm={true}>
			<Fieldset className='-mr-16 flex min-h-0 flex-col space-y-24 overflow-y-auto pr-16 text-xl font-bold'>
				<Legend className='sr-only'>Filter</Legend>
				<FormBlock title='General' className='mt-16'>
					<Checkbox
						name='hasNote'
						label='Has Note'
						checked={!!savedFilter.hasNote}
						onChange={checked => setSavedFilter(prev => ({...prev, hasNote: checked}))}
						error={!!errors.hasNote}
					/>
					<ErrorMessage error={errors.hasNote} />
				</FormBlock>
				<FormBlock title='Created At Date'>
					<div className='flex gap-12'>
						<Field className='w-1/2'>
							<Label className='sr-only'>Created At From</Label>
							<Input
								type='date'
								name='createdAtFrom'
								placeholder='dd/mm/yyy'
								value={savedFilter.createdAtFrom || ''}
								onChange={e => setSavedFilter(prev => ({...prev, createdAtFrom: e.target.value}))}
								error={!!errors.createdAtFrom}
							/>
							<ErrorMessage error={errors.createdAtFrom} />
						</Field>
						<Field className='w-1/2'>
							<Label className='sr-only'>Created At To</Label>
							<Input
								type='date'
								name='createdAtTo'
								placeholder='dd/mm/yyy'
								value={savedFilter.createdAtTo || ''}
								onChange={e => setSavedFilter(prev => ({...prev, createdAtTo: e.target.value}))}
								error={!!errors.createdAtTo}
							/>
							<ErrorMessage error={errors.createdAtTo} />
						</Field>
					</div>
				</FormBlock>
				<FormBlock title='Next Review Date'>
					<div className='flex gap-12'>
						<Field className='w-1/2'>
							<Label className='sr-only'>Next Review Date From</Label>
							<Input
								type='date'
								name='nextReviewDateFrom'
								placeholder='dd/mm/yyy'
								value={savedFilter.nextReviewDateFrom || ''}
								onChange={e => setSavedFilter(prev => ({...prev, nextReviewDateFrom: e.target.value}))}
								error={!!errors.nextReviewDateFrom}
							/>
							<ErrorMessage error={errors.nextReviewDateFrom} />
						</Field>
						<Field className='w-1/2'>
							<Label className='sr-only'>Next Review Date To</Label>
							<Input
								type='date'
								name='nextReviewDateTo'
								placeholder='dd/mm/yyy'
								value={savedFilter.nextReviewDateTo || ''}
								onChange={e => setSavedFilter(prev => ({...prev, nextReviewDateTo: e.target.value}))}
								error={!!errors.nextReviewDateTo}
							/>
							<ErrorMessage error={errors.nextReviewDateTo} />
						</Field>
					</div>
				</FormBlock>
				<FormBlock title='eFactor Range' className='mb-16'>
					<div className='flex gap-12'>
						<Field className='w-1/2'>
							<Label className='sr-only'>eFactor From</Label>
							<Input
								type='number'
								name='efactorFrom'
								min={1.3}
								max={2.5}
								step={0.1}
								placeholder='1.3'
								value={savedFilter.efactorFrom || ''}
								onChange={e => setSavedFilter(prev => ({...prev, efactorFrom: +e.target.value}))}
								error={!!errors.efactorFrom}
							/>
							<ErrorMessage error={errors.efactorFrom} />
						</Field>
						<Field className='w-1/2'>
							<Label className='sr-only'>eFactor To</Label>
							<Input
								type='number'
								name='efactorTo'
								min={1.3}
								max={4}
								step={0.1}
								placeholder='2.5'
								value={savedFilter.efactorTo || ''}
								onChange={e => setSavedFilter(prev => ({...prev, efactorTo: +e.target.value}))}
								error={!!errors.efactorTo}
							/>
							<ErrorMessage error={errors.efactorTo} />
						</Field>
					</div>
				</FormBlock>
			</Fieldset>
		</ModalWrapper>
	)
}
