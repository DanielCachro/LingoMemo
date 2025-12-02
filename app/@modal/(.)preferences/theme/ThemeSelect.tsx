'use client'
import RadioForm, {RadioOption} from '@/components/Form/RadioForm'
import PrimaryButton from '@/components/PrimaryButton'
import {useTheme} from 'next-themes'
import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'

export default function ThemeSelect({themeOptions}: {themeOptions: RadioOption[]}) {
	const [mounted, setMounted] = useState(false)
	const {theme, setTheme} = useTheme()

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return null
	}

	function handleSetTheme(value: string) {
		setTheme(value)
	}

	return (
		<>
			<RadioForm
				options={themeOptions}
				onSubmit={handleSetTheme}
				initialSelectedRadioValue={theme}
				submitButtonText='Set Theme'
			/>
			<PrimaryButton
				onClick={() => {
					toast.warning('Testowy toast')
					toast.error('Testowy toast')
					toast.info('Testowy toast')
					toast.success('Testowy toast')
					toast('Testowy toast')
				}}>
				Show Toast
			</PrimaryButton>
		</>
	)
}
