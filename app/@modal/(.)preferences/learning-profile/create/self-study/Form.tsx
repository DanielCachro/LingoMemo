'use client'
import {createLearningProfile} from '@/lib/actions/profile/manage'
import {faSignature} from '@fortawesome/free-solid-svg-icons'
import CreateProfileField from '../CreateProfileField'
import CreateProfileForm from '../CreateProfileForm'

export default function Form() {
	return (
		<CreateProfileForm
			heading='Creating Self-Study Profile'
			subheading='Name your learning profile'
			icon={faSignature}
			onSubmit={async event => {
				const formData = new FormData(event.currentTarget as HTMLFormElement)
				const data = Object.fromEntries(formData.entries())
				const profileName = data.profileName as string

				const result = await createLearningProfile({type: 'self-study', profileName})
				return result
			}}>
			{(formErrors, setFormErrors) => {
				const fieldError = formErrors?.errors.find(error => error.location === 'profileName')
				const formError = formErrors?.errors.find(error => error.location === 'form')
				return (
					<>
						<CreateProfileField
							type='input'
							name='profileName'
							label='My profile will be named:'
							placeholder='Enter profile name'
							onChange={() => {
								setFormErrors(prevErrors => {
									if (!prevErrors) return null
									return {
										...prevErrors,
										errors: prevErrors.errors.filter(
											error => error.location !== 'profileName' && error.location !== 'form',
										),
									}
								})
							}}
							errorMessage={fieldError?.message || formError?.message}
						/>
					</>
				)
			}}
		</CreateProfileForm>
	)
}
