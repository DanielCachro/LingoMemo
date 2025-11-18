'use client'
import ArrayField from '@/components/Form/ArrayField'
import Input from '@/components/Form/Input'
import TagField from '@/components/Form/TagField'
import Textarea from '@/components/Form/Textarea'
import {Field, Label} from '@headlessui/react'
import FormBlock from '../_components/FormBlock'
import FormSection from '../_components/FormSection'
import ModalWrapper from '../_components/ModalWrapper'

export default function FlashcardsCreateModal() {
	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const formData = new FormData(event.currentTarget)

		const data = {
			question: formData.get('question'),
			answer: formData.get('answer'),
			note: formData.get('note'),
			phonetic: formData.get('phonetic'),
			synonyms: JSON.parse((formData.get('synonyms') as string) || '[]'),
			examples: JSON.parse((formData.get('examples') as string) || '[]'),
		}

		console.log(data)
	}

	return (
		<ModalWrapper
			title='Create Flashcard'
			subtitle='Fill in the details to create a flashcard'
			buttonContent='Create Flashcard'
			useForm={true}
			onSubmit={handleSubmit}>
			<>
				<FormSection title='Core Details'>
					<FormBlock title='Question (front) *'>
						<Field>
							<Label className='sr-only'>Question (front)</Label>
							<Input type='text' name='question' placeholder='Question on the front side' />
						</Field>
					</FormBlock>
					<FormBlock title='Answer (back) *'>
						<Field>
							<Label className='sr-only'>Answer (back)</Label>
							<Input type='text' name='answer' placeholder='Answer for the question' />
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
					<FormBlock title='Phonetic'>
						<Field>
							<Label className='sr-only'>Phonetic</Label>
							<Input type='text' name='phonetic' placeholder='e.g., /həˈləʊ/' />
						</Field>
					</FormBlock>
					<FormBlock title='Synonyms'>
						<Field>
							<Label className='sr-only'>Synonyms</Label>
							<TagField name='synonyms' />
						</Field>
					</FormBlock>
					<FormBlock title='Examples'>
						<Field>
							<Label className='sr-only'>Examples</Label>
							<ArrayField name='examples' />
						</Field>
					</FormBlock>
				</FormSection>
			</>
		</ModalWrapper>
	)
}
