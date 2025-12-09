'use client'

import {createLearningProfile} from '@/lib/actions/profile/manage'
import {SourceLanguages, TargetLanguages} from '@/lib/generated/prisma/browser'
import {languageCodeToName} from '@/lib/utils'
import {faLanguage} from '@fortawesome/free-solid-svg-icons'
import CreateProfileField from './Field'
import CreateProfileForm from './Form'

const sourceLanguageOptions = Object.values(SourceLanguages).map(lang => ({
	value: lang,
	label: languageCodeToName(lang),
}))

const targetLanguageOptions = Object.values(TargetLanguages).map(lang => ({
	value: lang,
	label: languageCodeToName(lang),
}))

export default function Form({redirectTo, className}: {redirectTo: string; className?: string}) {
	return (
		<CreateProfileForm
			heading='Creating Language Profile'
			subheading='Select your learning languages'
			icon={faLanguage}
			className={className}
			onSubmit={async event => {
				const formData = new FormData(event.currentTarget as HTMLFormElement)
				const data = Object.fromEntries(formData.entries())

				const sourceLang = data['sourceLanguage[value]'] as SourceLanguages
				const targetLang = data['targetLanguage[value]'] as TargetLanguages

				const result = await createLearningProfile(
					{type: 'language', sourceLang, targetLang},
					{revalidateAfter: true, pathToRevalidate: redirectTo, type: 'page', redirectTo},
				)
				return result
			}}>
			{(formErrors, setFormErrors) => {
				const sourceError = formErrors?.errors?.find(error => error.location === 'sourceLang')
				const targetError = formErrors?.errors?.find(error => error.location === 'targetLang')
				const formError = formErrors?.errors?.find(error => error.location === 'form')
				return (
					<>
						<CreateProfileField
							type='select'
							name='sourceLanguage'
							label='From the source language:'
							placeholder='Please choose a language'
							options={sourceLanguageOptions}
							onFocus={() => {
								setFormErrors(prevErrors => {
									if (!prevErrors) return null
									return {
										...prevErrors,
										errors: prevErrors.errors
											? prevErrors.errors.filter(error => error.location !== 'sourceLang' && error.location !== 'form')
											: undefined,
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
							options={targetLanguageOptions}
							onFocus={() => {
								setFormErrors(prevErrors => {
									if (!prevErrors) return null
									return {
										...prevErrors,
										errors: prevErrors.errors
											? prevErrors.errors.filter(error => error.location !== 'targetLang' && error.location !== 'form')
											: undefined,
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
