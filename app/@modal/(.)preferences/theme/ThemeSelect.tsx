'use client'
import RadioForm, {RadioOption} from '@/components/Form/RadioForm'
import {useTheme} from 'next-themes'
import {useEffect, useState} from 'react'

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
		</>
	)
}
