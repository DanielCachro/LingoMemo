'use client'

import RadioForm from '@/components/Tiles/RadioTileForm'
import {setActiveLearningProfile} from '@/lib/actions/user'
import {useRouter} from 'next/navigation'

export default function ProfileSelect({
	radios,
	activeLearningProfileId,
}: {
	radios: {value: string; children: React.ReactNode}[]
	activeLearningProfileId: string
}) {
	const router = useRouter()

	return (
		<RadioForm
			radios={radios}
			initialSelectedRadio={activeLearningProfileId}
			radioGroupName='learning-profile'
			onSubmit={async selectedOption => {
				await setActiveLearningProfile(Number(selectedOption))
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
	)
}
