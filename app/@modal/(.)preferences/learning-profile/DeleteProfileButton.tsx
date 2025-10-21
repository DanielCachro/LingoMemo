'use client'

export default function DeleteProfileButton({profileId}: {profileId: number}) {
	return (
		<button
			type='button'
			className='rounded-sm bg-error-600 px-12 py-8 font-bold text-error-100 transition-colors duration-50 hover:cursor-pointer hover:bg-error-500 dark:bg-error-700 dark:hover:bg-error-600'
			onClick={() => console.log('Removing profile ', profileId)}>
			Delete Profile
		</button>
	)
}
