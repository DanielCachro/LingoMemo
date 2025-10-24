'use client'
import Select from '@/components/Form/Select'
import PrimaryButton from '@/components/PrimaryButton'
import SlabBorder from '@/components/SlabBorder'
import {createLearningProfile} from '@/lib/actions/profile/manage'
import {languageCodeToName} from '@/lib/utils'
import {faLanguage, faSpinner} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Field, Label} from '@headlessui/react'
import {SourceLanguages, TargetLanguages} from '@prisma/client'
import {useRouter} from 'next/navigation'
import {useState, useTransition} from 'react'

export default function CreateProfileForm() {
	const [formErrors, setFormErrors] = useState<Awaited<ReturnType<typeof createLearningProfile>> | null>(null)
	const sourceLanguages = Object.values(SourceLanguages)
	const targetLanguages = Object.values(TargetLanguages)
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

				<Field className='flex flex-col gap-8'>
					<Label className='font-bold'>From the source language:</Label>
					<Select
						name='sourceLanguage'
						placeholder='Please choose a language'
						options={sourceLanguages.map(lang => ({value: lang, label: languageCodeToName(lang)}))}
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
						error={formErrors?.errors.some(error => error.location === 'sourceLang')}
					/>
					{formErrors?.errors.find(error => error.location === 'sourceLang') && (
						<p className='text-sm text-error-500'>
							{formErrors.errors.find(error => error.location === 'sourceLang')?.message}
						</p>
					)}
				</Field>

				<Field className='flex flex-col gap-8'>
					<Label className='font-bold'>I want to learn:</Label>
					<Select
						name='targetLanguage'
						placeholder='Please choose a language'
						options={targetLanguages.map(lang => ({value: lang, label: languageCodeToName(lang)}))}
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
						error={formErrors?.errors.some(error => error.location === 'targetLang')}
					/>
					{formErrors?.errors.find(error => error.location === 'targetLang') && (
						<p className='text-sm text-error-500'>
							{formErrors.errors.find(error => error.location === 'targetLang')?.message}
						</p>
					)}
				</Field>
				
				{formErrors?.errors.find(error => error.location === 'form') && (
					<p className='text-sm text-error-500'>
						{formErrors.errors.find(error => error.location === 'form')?.message}
					</p>
				)}
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
