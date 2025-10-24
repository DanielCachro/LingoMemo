'use client'

import PrimaryButton from '@/components/PrimaryButton'
import SecondaryButton from '@/components/SecondaryButton'
import {LearningProfile} from '@prisma/client'
import {ButtonHTMLAttributes, useState} from 'react'
import Modal from '../../_components/Modal'
import ProfileDetails from './ProfileDetails'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	profile: LearningProfile
	onDelete: (id: number) => Promise<void>
}

export default function DeleteProfileButton({profile, onDelete, ...props}: Props) {
	const [showDialog, setShowDialog] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	return (
		<>
			{showDialog && (
				<Modal
					key={`delete-profile-modal-${profile.id}`}
					header='none'
					heading='confirmation modal'
					mobileScreenCoverage='2/3'
					closingType='dialogClose'
					onClose={() => setShowDialog(false)}>
					<div className='space-y-16 p-24'>
						<p>You are about to delete profile</p>
						<div className='rounded-sm border-2 border-background-200 p-16 dark:border-background-800'>
							<ProfileDetails profile={profile} />
						</div>
						<p>Are you sure?</p>
						<div className='space-x-16'>
							<SecondaryButton
								className='w-128'
								onClick={async () => {
									try {
										setIsLoading(true)
										await onDelete(profile.id)
										setShowDialog(false)
									} catch (error) {
										// TODO: Show toast
										console.error('Error deleting profile:', error)
									} finally {
										setIsLoading(false)
									}
								}}
								disabled={isLoading}>
								{isLoading ? <span className='animate-pulse'>Deleting...</span> : 'Yes, Delete'}
							</SecondaryButton>
							<PrimaryButton className='w-128' onClick={() => setShowDialog(false)} disabled={isLoading}>
								No
							</PrimaryButton>
						</div>
					</div>
				</Modal>
			)}
			<button
				type='button'
				className='rounded-sm bg-error-600 px-12 py-8 font-bold text-error-100 transition-colors duration-50 hover:cursor-pointer hover:bg-error-500 dark:bg-error-700 dark:hover:bg-error-600'
				onClick={() => {
					setShowDialog(true)
				}}
				{...props}>
				Delete Profile
			</button>
		</>
	)
}
