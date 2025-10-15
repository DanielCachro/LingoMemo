import Breadcrumbs from '@/components/Breadcrumbs'
import Modal from '../_components/Modal'

export default async function PreferencesLayout({children}: {children: React.ReactNode}) {
	return (
		<Modal header='mobile' heading='Preferences'>
			<Breadcrumbs
				rootSegment='preferences'
				variant='bordered'
				className='mx-16 mt-12 text-background-500 dark:text-background-400'
			/>
			<div className='px-16 py-32'>{children}</div>
		</Modal>
	)
}
