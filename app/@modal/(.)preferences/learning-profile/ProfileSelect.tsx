'use client'

import RadioForm, {Skeleton as RadioFormSkeleton, RadioOption} from '@/components/Form/RadioForm'
import {deleteLearningProfile} from '@/lib/actions/profile/manage'
import {setActiveLearningProfile} from '@/lib/actions/user'
import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {LearningProfile} from '@prisma/client'
import {useQueryClient} from '@tanstack/react-query'
import {useRouter} from 'next/navigation'
import {KeyboardEvent, useTransition} from 'react'
import DeleteProfileButton from './DeleteProfileButton'
import ProfileDetails from './ProfileDetails'

export default function ProfileSelect({
	learningProfiles,
	activeLearningProfileId,
}: {
	learningProfiles: LearningProfile[]
	activeLearningProfileId: string
}) {
	const router = useRouter()
	const queryClient = useQueryClient()
	const [isDeletePending, deleteStartTransition] = useTransition()
	const [isChangePending, changeStartTransition] = useTransition()

	const handleDelete = async (profileId: number) => {
		try {
			await deleteLearningProfile(profileId)
		} catch (error) {
			// TODO: Show toast
			console.error(error)
		}

		deleteStartTransition(() => {
			router.refresh()
		})
	}

	const handleChangeProfile = async (selectedOption: string) => {
		changeStartTransition(async () => {
			try {
				await setActiveLearningProfile(Number(selectedOption), {
					revalidateAfter: true,
					pathToRevalidate: '/home',
					type: 'layout',
				})
				queryClient.removeQueries()
			} catch (error) {
				// TODO: Show toast
				console.error(error)
			}
			router.push('/home')
		})
	}

	const options: RadioOption[] = learningProfiles.map(profile => {
		return {
			value: String(profile.id),
			children: (
				<div className='space-y-24'>
					<ProfileDetails profile={profile} />
					<DeleteProfileButton
						profile={profile}
						onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
							if (event.key === 'Enter') {
								event.stopPropagation()
							}
						}}
						onDelete={handleDelete}
						disabled={isDeletePending || isChangePending}
					/>
				</div>
			),
		}
	})

	return (
		<>
			{isDeletePending && <RadioFormSkeleton />}
			{!isDeletePending && (
				<RadioForm
					options={options}
					initialSelectedRadioValue={activeLearningProfileId}
					submitButtonText={
						isChangePending ? (
							<span className='animate-pulse'>
								<FontAwesomeIcon icon={faSpinner} spin /> Swithing Profile...
							</span>
						) : (
							'Switch to This Profile'
						)
					}
					radioGroupName='learning-profile'
					onSubmit={selectedOption => handleChangeProfile(selectedOption)}
					additionalButtons={[
						{
							id: 'create-new',
							type: 'secondary',
							children: 'Create New Profile',
							onClick: () => router.push('/preferences/learning-profile/create'),
						},
					]}
					className='h-full space-y-48'
				/>
			)}
		</>
	)
}
