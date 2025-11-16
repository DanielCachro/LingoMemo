'use client'
import Input from '@/components/Form/Input'
import Textarea from '@/components/Form/Textarea'
import {Field, Label} from '@headlessui/react'
import FormBlock from '../_components/FormBlock'
import FormSection from '../_components/FormSection'
import ModalWrapper from '../_components/ModalWrapper'

export default function FlashcardsCreateModal() {
	return (
		<ModalWrapper
			title='Create Flashcard'
			subtitle='Fill in the details to create a flashcard'
			buttonContent='Create Flashcard'
			useForm={true}
			onSubmit={event => {
				console.log(event)
			}}>
			<>
				<FormSection title='Core Details'>
					<FormBlock title='Question (front) *'>
						<Field>
							<Label className='sr-only'>Question (front)</Label>
							<Input type='text' name='questionFront' placeholder='Question on the front side' />
						</Field>
					</FormBlock>
					<FormBlock title='Answer (back) *'>
						<Field>
							<Label className='sr-only'>Answer (back)</Label>
							<Input type='text' name='answerBack' placeholder='Answer for the question' />
						</Field>
					</FormBlock>
					<FormBlock title='Note'>
						<Field>
							<Label className='sr-only'>Note</Label>
							<Textarea className='max-h-192' name='note' placeholder='Any additional notes or context' />
						</Field>
					</FormBlock>
				</FormSection>
				<FormSection title='Vocabulary Related'>
					<Field>
						<Label className='sr-only'>Phonetic</Label>
						<Input type='text' name='phonetic' placeholder='e.g., /həˈləʊ/' />
					</Field>
				</FormSection>
			</>
		</ModalWrapper>
	)
}
