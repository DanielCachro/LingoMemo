'use client'

import {useTheme} from 'next-themes'
import {Bounce, ToastContainer} from 'react-toastify'

export default function AppToast() {
	const {resolvedTheme} = useTheme()

	return (
		<>
			<ToastContainer
				position='top-right'
				autoClose={4000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable
				draggablePercent={45}
				pauseOnHover
				closeButton={false}
				transition={Bounce}
				theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
				limit={5}
			/>
		</>
	)
}
