'use client'

import RadioForm from '@/components/Tiles/RadioTileForm'
import {useRouter} from 'next/navigation'

export default function LearningProfileModal() {
	const router = useRouter()
	const DUMMY_RADIOS = [
		{value: '1', children: 'Profile 1'},
		{value: '2', children: 'Profile 2'},
	]

	return (
		<RadioForm
			radios={DUMMY_RADIOS}
			radioGroupName='learning-profile'
			onSubmit={selectedOption => {
				console.log('Selected profile:', selectedOption)
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
