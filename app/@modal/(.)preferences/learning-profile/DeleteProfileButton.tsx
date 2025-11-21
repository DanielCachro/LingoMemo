'use client'

import DeleteItemModal from '@/app/@modal/_components/DeleteItemModal' // Adjust path if needed
import {LearningProfile} from '@prisma/client'
import {ButtonHTMLAttributes, useState} from 'react'
import ProfileDetails from './ProfileDetails'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	profile: LearningProfile
	onDelete: (id: number) => Promise<void>
}

export default function DeleteProfileButton({profile, onDelete, ...props}: Props) {
	const [showDialog, setShowDialog] = useState(false)

	return (
		<>
			{showDialog && (
				<DeleteItemModal
					heading='You are about to delete profile'
					onClose={() => setShowDialog(false)}
					onConfirm={async () => {
						await onDelete(profile.id)
					}}>
					<ProfileDetails profile={profile} />
				</DeleteItemModal>
			)}

			<button
				type='button'
				className='rounded-sm bg-error-600 px-12 py-8 font-bold text-error-100 transition-colors duration-50 hover:cursor-pointer hover:bg-error-500 dark:bg-error-700 dark:hover:bg-error-600'
				onClick={() => setShowDialog(true)}
				{...props}>
				Delete Profile
			</button>
		</>
	)
}
