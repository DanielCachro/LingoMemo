'use client'
import PrimaryButton from '@/components/PrimaryButton'
import SlabBorder from '@/components/SlabBorder'
import {createLearningProfile} from '@/lib/actions/profile/manage'
import {languageCodeToName} from '@/lib/utils'
import {faLanguage, faSpinner} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {SourceLanguages, TargetLanguages} from '@prisma/client'
import {useRouter} from 'next/navigation'
import {useState, useTransition} from 'react'
import CreateProfileSelect from './CreateProfileSelect'

const sourceLanguages = Object.values(SourceLanguages).map(lang => ({
	value: lang,
	label: languageCodeToName(lang),
}))

const targetLanguages = Object.values(TargetLanguages).map(lang => ({
	value: lang,
	label: languageCodeToName(lang),
}))

export default function CreateProfileForm() {
	const [formErrors, setFormErrors] = useState<Awaited<ReturnType<typeof createLearningProfile>> | null>(null)
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget as HTMLFormElement)
		const data = Object.fromEntries(formData.entries())
		const sourceLang = data['sourceLanguage[value]'] as SourceLanguages
		const targetLang = data['targetLanguage[value]'] as TargetLanguages

		startTransition(async () => {
			const result = await createLearningProfile({type: 'language', sourceLang: sourceLang, targetLang: targetLang})

			if (result?.errors) {
				setFormErrors(result)
			} else {
				router.push('/preferences/learning-profile')
			}
		})
	}

	const sourceError = formErrors?.errors.find(error => error.location === 'sourceLang')
	const targetError = formErrors?.errors.find(error => error.location === 'targetLang')
	const formError = formErrors?.errors.find(error => error.location === 'form')

	return (
		<form className='flex h-full flex-col justify-between sm:gap-128' onSubmit={handleSubmit}>
			<SlabBorder className='space-y-32 p-24'>
				<div className='flex gap-16'>
					<div className='flex h-48 w-48 items-center justify-center rounded-full bg-accent-100 text-accent-500'>
						<FontAwesomeIcon size='lg' icon={faLanguage} aria-hidden='true' />
					</div>
					<div>
						<h2 className='font-bold'>Creating Learning Profile</h2>
						<p>Select your learning languages</p>
					</div>
				</div>
				<CreateProfileSelect
					name='sourceLanguage'
					label='From the source language:'
					options={sourceLanguages}
					onFocus={() => {
						setFormErrors(prevErrors => {
							if (!prevErrors) return null
							return {
								...prevErrors,
								errors: prevErrors.errors.filter(error => error.location !== 'sourceLang' && error.location !== 'form'),
							}
						})
					}}
					errorMessage={sourceError?.message}
				/>
				<CreateProfileSelect
					name='targetLanguage'
					label='From the target language:'
					options={targetLanguages}
					onFocus={() => {
						setFormErrors(prevErrors => {
							if (!prevErrors) return null
							return {
								...prevErrors,
								errors: prevErrors.errors.filter(error => error.location !== 'targetLang' && error.location !== 'form'),
							}
						})
					}}
					errorMessage={targetError?.message}
				/>
				{formError && <p className='text-sm text-error-500'>{formError?.message}</p>}
			</SlabBorder>
			<PrimaryButton type='submit'>
				{isPending ? (
					<span className='animate-pulse'>
						<FontAwesomeIcon icon={faSpinner} spin /> Creating...
					</span>
				) : (
					'Create Learning Profile'
				)}
			</PrimaryButton>
		</form>
	)
}
