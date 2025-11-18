'use client'
import {useModalData} from '@/app/ModalDataProvider'
import Checkbox from '@/components/Form/Chceckbox'
import {useState} from 'react'
import z from 'zod'
import FieldPair from '../_components/FieldPair'
import FormBlock from '../_components/FormBlock'
import ModalWrapper from '../_components/ModalWrapper'
import {initialFlashcardsFilter} from './initial'
import {FlashcardsFilter, schema} from './schema'

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
			<>
				<FormBlock title='General'>
					<Checkbox
						name='hasNote'
						label='Has Note'
						checked={!!savedFilter.hasNote}
						onChange={checked => setSavedFilter(prev => ({...prev, hasNote: checked}))}
						error={!!errors.hasNote}
						errorMessage={errors.hasNote[0]}
					/>
				</FormBlock>
				<FormBlock title='Created At Date'>
					<FieldPair
						firstField={{
							label: 'Created At From',
							type: 'date',
							name: 'createdAtFrom',
							placeholder: 'dd/mm/yyy',
							value: savedFilter.createdAtFrom || '',
							onChange: value => setSavedFilter(prev => ({...prev, createdAtFrom: value})),
							error: !!errors.createdAtFrom,
							errorMessage: errors.createdAtFrom[0],
						}}
						secondField={{
							label: 'Created At To',
							type: 'date',
							name: 'createdAtTo',
							placeholder: 'dd/mm/yyy',
							value: savedFilter.createdAtTo || '',
							onChange: value => setSavedFilter(prev => ({...prev, createdAtTo: value})),
							error: !!errors.createdAtTo,
							errorMessage: errors.createdAtTo[0],
						}}
					/>
				</FormBlock>
				<FormBlock title='Next Review Date'>
					<FieldPair
						firstField={{
							label: 'Next Review Date From',
							type: 'date',
							name: 'nextReviewDateFrom',
							placeholder: 'dd/mm/yyy',
							value: savedFilter.nextReviewDateFrom || '',
							onChange: value => setSavedFilter(prev => ({...prev, nextReviewDateFrom: value})),
							error: !!errors.nextReviewDateFrom,
							errorMessage: errors.nextReviewDateFrom[0],
						}}
						secondField={{
							label: 'Next Review Date To',
							type: 'date',
							name: 'nextReviewDateTo',
							placeholder: 'dd/mm/yyy',
							value: savedFilter.nextReviewDateTo || '',
							onChange: value => setSavedFilter(prev => ({...prev, nextReviewDateTo: value})),
							error: !!errors.nextReviewDateTo,
							errorMessage: errors.nextReviewDateTo[0],
						}}
					/>
				</FormBlock>
				<FormBlock title='eFactor Range' className='mb-16'>
					<FieldPair
						firstField={{
							label: 'eFactor From',
							type: 'number',
							name: 'efactorFrom',
							min: 1.3,
							max: 2.5,
							step: 0.01,
							placeholder: '1.3',
							value: savedFilter.efactorFrom || '',
							onChange: value => setSavedFilter(prev => ({...prev, efactorFrom: +value})),
							error: !!errors.efactorFrom,
							errorMessage: errors.efactorFrom[0],
						}}
						secondField={{
							label: 'eFactor To',
							type: 'number',
							name: 'efactorTo',
							min: 1.3,
							max: 4,
							step: 0.01,
							placeholder: '2.5',
							value: savedFilter.efactorTo || '',
							onChange: value => setSavedFilter(prev => ({...prev, efactorTo: +value})),
							error: !!errors.efactorTo,
							errorMessage: errors.efactorTo[0],
						}}
					/>
				</FormBlock>
			</>
		</ModalWrapper>
	)
}
