'use client'
import Breadcrumbs from '@/components/Breadcrumbs'
import dynamic from 'next/dynamic'
const Modal = dynamic(() => import('../_components/Modal'), {ssr: false})

export default function PreferencesLayout({children}: {children: React.ReactNode}) {
	return (
		<Modal header='mobile' heading='Preferences' className='sm:w-640'>
			{() => (
				<div className='flex h-full flex-col'>
					<Breadcrumbs
						rootSegment='preferences'
						variant='bordered'
						className='mx-16 mt-12 text-background-500 dark:text-background-400'
					/>
					<div className='h-full overflow-auto px-16 py-32'>{children}</div>
				</div>
			)}
		</Modal>
	)
}
