'use client'
import PrimaryButton from '@/components/PrimaryButton'
import SlabBorder from '@/components/SlabBorder'
import {createLearningProfile} from '@/lib/actions/profile/manage'
import {faSpinner, IconDefinition} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useRouter} from 'next/navigation'
import {Dispatch, useState, useTransition} from 'react'

type FormErrorsType = Awaited<ReturnType<typeof createLearningProfile>> | null

interface Props {
	heading: string
	subheading: string
	icon: IconDefinition
	children: (
		formErrors: FormErrorsType,
		setFormErrors: Dispatch<React.SetStateAction<FormErrorsType>>,
	) => React.ReactNode
	onSubmit: (event: React.FormEvent) => ReturnType<typeof createLearningProfile>
}

export default function CreateProfileForm({heading, subheading, icon, children, onSubmit}: Props) {
	const [formErrors, setFormErrors] = useState<FormErrorsType>(null)
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()

		startTransition(async () => {
			const result = await onSubmit(event)

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
						<FontAwesomeIcon size='lg' icon={icon} aria-hidden='true' />
					</div>
					<div>
						<h2 className='font-bold'>{heading}</h2>
						<p>{subheading}</p>
					</div>
				</div>
				{children(formErrors, setFormErrors)}
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
