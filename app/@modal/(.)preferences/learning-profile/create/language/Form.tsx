'use client'
import {createLearningProfile} from '@/lib/actions/profile/manage'
import {languageCodeToName} from '@/lib/utils'
import {SourceLanguages, TargetLanguages} from '@prisma/client'
import CreateProfileField from '../CreateProfileField'
import CreateProfileForm from '../CreateProfileForm'

const sourceLanguages = Object.values(SourceLanguages).map(lang => ({
	value: lang,
	label: languageCodeToName(lang),
}))

const targetLanguages = Object.values(TargetLanguages).map(lang => ({
	value: lang,
	label: languageCodeToName(lang),
}))

export default function Form() {
	return (
		<CreateProfileForm
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
							label='From the target language:'
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
