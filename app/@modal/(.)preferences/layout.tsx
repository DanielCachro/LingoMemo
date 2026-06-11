import Breadcrumbs from '@/components/Breadcrumbs'
import AnimatedModalContent from '../_components/AnimatedModalContent'
import Modal from '../_components/Modal'

export default function PreferencesLayout({children}: {children: React.ReactNode}) {
	return (
		<>
			<Modal header='mobile' heading='Preferences' className='sm:w-640'>
				<div className='flex h-full flex-col'>
					<Breadcrumbs variant='bordered' className='mx-16 mt-12 text-background-500 dark:text-background-400' />
					<AnimatedModalContent>{children}</AnimatedModalContent>
				</div>
			</Modal>
		</>
	)
}
