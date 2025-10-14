import Modal from '../_components/Modal'
export default async function PreferencesLayout({children}: {children: React.ReactNode}) {
	return (
		<Modal header='mobile' heading='Preferences'>
			{children}
		</Modal>
	)
}
