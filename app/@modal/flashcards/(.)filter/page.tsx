'use client'
import {useModalData} from '@/app/ModalDataProvider'
import Checkbox from '@/components/Form/Chceckbox'
import Input from '@/components/Form/Input'
import PrimaryButton from '@/components/PrimaryButton'
import {Field, Fieldset, Label, Legend} from '@headlessui/react'
import dynamic from 'next/dynamic'
import FormBlock from '../_components/FormBlock'
const Modal = dynamic(() => import('../../_components/Modal'), {ssr: false})

export type FlashcardsFilter = {
	hasNote?: boolean
	createdAtFrom?: string
	createdAtTo?: string
	nextReviewDateFrom?: string
	nextReviewDateTo?: string
	efactorFrom?: number
	efactorTo?: number
}

export default function FlashcardsFilterModal() {
	const {setData, getData} = useModalData()
	const savedFilter = getData<FlashcardsFilter>('flashcardsFilter')

	return (
		<Modal header='both' heading='Filter' mobileScreenCoverage='2/3'>
			{closeModal => {
				function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
					event.preventDefault()

					const formData = new FormData(event.currentTarget)
					const data: FlashcardsFilter = {
						hasNote: formData.get('hasNote') === 'on' ? true : false,
						createdAtFrom: formData.get('createdAtFrom')?.toString() || undefined,
						createdAtTo: formData.get('createdAtTo')?.toString() || undefined,
						nextReviewDateFrom: formData.get('nextReviewDateFrom')?.toString() || undefined,
						nextReviewDateTo: formData.get('nextReviewDateTo')?.toString() || undefined,
						efactorFrom: formData.get('efactorFrom') ? Number(formData.get('efactorFrom')) : undefined,
						efactorTo: formData.get('efactorTo') ? Number(formData.get('efactorTo')) : undefined,
					}
					setData<FlashcardsFilter>('flashcardsFilter', data)
					closeModal()
				}

				return (
					<form className='flex h-full flex-col justify-between space-y-16 p-16 pt-0' onSubmit={handleSubmit}>
						<Fieldset className='-mr-16 flex min-h-0 flex-col space-y-24 overflow-y-auto pr-16 text-xl font-bold'>
							<Legend className='sr-only'>Filter</Legend>
							<FormBlock title='General' className='mt-16'>
								<Checkbox name='hasNote' label='Has Note' defaultChecked={savedFilter?.hasNote} />
							</FormBlock>
							<FormBlock title='Created At Date'>
								<div className='flex gap-12'>
									<Field className='w-1/2'>
										<Label className='sr-only'>Created At From</Label>
										<Input
											type='date'
											name='createdAtFrom'
											placeholder='dd/mm/yyy'
											defaultValue={savedFilter?.createdAtFrom}
										/>
									</Field>
									<Field className='w-1/2'>
										<Label className='sr-only'>Created At To</Label>
										<Input
											type='date'
											name='createdAtTo'
											placeholder='dd/mm/yyy'
											defaultValue={savedFilter?.createdAtTo}
										/>
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
											defaultValue={savedFilter?.nextReviewDateFrom}
										/>
									</Field>
									<Field className='w-1/2'>
										<Label className='sr-only'>Next Review Date To</Label>
										<Input
											type='date'
											name='nextReviewDateTo'
											placeholder='dd/mm/yyy'
											defaultValue={savedFilter?.nextReviewDateTo}
										/>
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
											defaultValue={savedFilter?.efactorFrom}
										/>
									</Field>
									<Field className='w-1/2'>
										<Label className='sr-only'>eFactor To</Label>
										<Input
											type='number'
											name='efactorTo'
											min={1.3}
											max={2.5}
											step={0.1}
											placeholder='2.5'
											defaultValue={savedFilter?.efactorTo}
										/>
									</Field>
								</div>
							</FormBlock>
						</Fieldset>
						<PrimaryButton type='submit'>Apply Filters</PrimaryButton>
					</form>
				)
			}}
		</Modal>
	)
}
