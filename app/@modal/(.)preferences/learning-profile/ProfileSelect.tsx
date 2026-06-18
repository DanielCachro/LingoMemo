'use client'

import RadioForm, {Skeleton as RadioFormSkeleton, RadioOption} from '@/components/Form/RadioForm'
import {deleteLearningProfile} from '@/lib/actions/profile/manage'
import {setActiveLearningProfile} from '@/lib/actions/user'
import {LearningProfile} from '@/lib/generated/prisma/browser'
import {languageCodeToName} from '@/lib/utils/languageCodeToName'
import {useQueryClient} from '@tanstack/react-query'
import {useRouter} from 'next/navigation'
import {KeyboardEvent, useEffect, useTransition} from 'react'
import {toast} from 'react-toastify'
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
			const result = await deleteLearningProfile(profileId)
			if (!result.success) {
				toast.error(result.error || 'Failed to delete profile. Please try again.')
				return
			}
		} catch (error) {
			toast.error('Failed to delete profile. Please try again.')
			console.error(error)
			return
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
				const selectedProfile = learningProfiles.find(profile => profile.id === Number(selectedOption))

				const sourceLang = selectedProfile?.sourceLang
				const targetLang = selectedProfile?.targetLang

				const displayName = selectedProfile?.profileName ? (
					<>
						profile <span className='font-bold'>{selectedProfile.profileName}</span>
					</>
				) : sourceLang && targetLang ? (
					<>
						learning <span className='font-bold'>{languageCodeToName(targetLang)}</span> from{' '}
						<span className='font-bold'>{languageCodeToName(sourceLang)}</span>
					</>
				) : null

				toast.success(displayName ? <p>Switched to {displayName}</p> : 'Learning profile switched successfully')
			} catch (error) {
				toast.error('Failed to switch profile. Please try again.')
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

	useEffect(() => {
		router.prefetch('/preferences/learning-profile/create')
	}, [router])

	return (
		<>
			{isDeletePending && <RadioFormSkeleton />}
			{!isDeletePending && (
				<RadioForm
					options={options}
					initialSelectedRadioValue={activeLearningProfileId}
					submitButtonText={
						isChangePending ? <span className='animate-pulse'>Swithing Profile...</span> : 'Switch to This Profile'
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
