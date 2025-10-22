'use client'

import RadioTileForm, {Skeleton as RadioTileFormSkeleton} from '@/components/Tiles/RadioTileForm'
import {deleteLearningProfile} from '@/lib/actions/profile/manage'
import {setActiveLearningProfile} from '@/lib/actions/user'
import {LearningProfile} from '@prisma/client'
import {useRouter} from 'next/navigation'
import {useTransition} from 'react'
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

	const [isPending, startTransition] = useTransition()

	const handleDelete = async (profileId: number) => {
		try {
			await deleteLearningProfile(profileId)
		} catch (error) {
			// TODO: Show toast
			console.error(error)
		}

		startTransition(() => {
			router.refresh()
		})
	}

	const radios = learningProfiles.map(profile => {
		return {
			value: String(profile.id),
			children: (
				<div className='space-y-24'>
					<ProfileDetails profile={profile} />
					<DeleteProfileButton profile={profile} onDelete={handleDelete} />
				</div>
			),
		}
	})

	return (
		<>
			{isPending && <RadioTileFormSkeleton />}
			{!isPending && (
				<RadioTileForm
					radios={radios}
					initialSelectedRadio={activeLearningProfileId}
					radioGroupName='learning-profile'
					onSubmit={async selectedOption => {
						await setActiveLearningProfile(Number(selectedOption), {
							revalidateAfter: true,
							pathToRevalidate: '/home',
							type: 'layout',
						})
						router.push('/home')
					}}
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
