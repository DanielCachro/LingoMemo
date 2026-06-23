'use client'

export default function ResetConsentButton() {
	const handleReset = () => {
		window.dispatchEvent(new Event('reset-cookie-consent'))
	}

	return (
		<button
			onClick={handleReset}
			className='cursor-pointer text-left underline transition-colors hover:text-primary-500 dark:hover:text-primary-600'>
			click here to change your cookie preferences.
		</button>
	)
}
