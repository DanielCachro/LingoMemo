'use client'
import {createLearningProfile} from '@/lib/actions/profile/manage'
import {SourceLanguages, TargetLanguages} from '@/lib/generated/prisma/browser'
import {faLanguage} from '@fortawesome/free-solid-svg-icons'
import CreateProfileField from '../CreateProfileField'
import CreateProfileForm from '../CreateProfileForm'

export default function Form({
	sourceLanguages,
	targetLanguages,
}: {
	sourceLanguages: {value: SourceLanguages; label: string}[]
	targetLanguages: {value: TargetLanguages; label: string}[]
}) {
	return (
		<CreateProfileForm
			heading='Creating Language Profile'
			subheading='Select your learning languages'
			icon={faLanguage}
			onSubmit={async event => {
				const formData = new FormData(event.currentTarget as HTMLFormElement)
				const data = Object.fromEntries(formData.entries())

				const sourceLang = data['sourceLanguage[value]'] as SourceLanguages
				const targetLang = data['targetLanguage[value]'] as TargetLanguages

				const result = await createLearningProfile({type: 'language', sourceLang, targetLang})
				return result
			}}>
			{(formErrors, setFormErrors) => {
				const sourceError = formErrors?.errors.find(error => error.location === 'sourceLang')
				const targetError = formErrors?.errors.find(error => error.location === 'targetLang')
				const formError = formErrors?.errors.find(error => error.location === 'form')
				return (
					<>
						<CreateProfileField
							type='select'
							name='sourceLanguage'
							label='From the source language:'
							placeholder='Please choose a language'
							options={sourceLanguages}
							onFocus={() => {
								setFormErrors(prevErrors => {
									if (!prevErrors) return null
									return {
										...prevErrors,
										errors: prevErrors.errors.filter(
											error => error.location !== 'sourceLang' && error.location !== 'form',
										),
									}
								})
							}}
							errorMessage={sourceError?.message}
						/>
						<CreateProfileField
							type='select'
							name='targetLanguage'
							label='I want to learn:'
							placeholder='Please choose a language'
							options={targetLanguages}
							onFocus={() => {
								setFormErrors(prevErrors => {
									if (!prevErrors) return null
									return {
										...prevErrors,
										errors: prevErrors.errors.filter(
											error => error.location !== 'targetLang' && error.location !== 'form',
										),
									}
								})
							}}
							errorMessage={targetError?.message}
						/>
						{formError && <p className='text-sm text-error-500'>{formError?.message}</p>}
					</>
				)
			}}
		</CreateProfileForm>
	)
}
