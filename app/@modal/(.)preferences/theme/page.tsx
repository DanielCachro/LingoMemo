import {RadioOption} from '@/components/Form/RadioForm'
import {faMoon, faSun, faWandMagicSparkles} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import ThemeSelect from './ThemeSelect'

const themeOptions: RadioOption[] = [
	{
		value: 'light',
		children: (
			<p className='space-x-12'>
				<FontAwesomeIcon icon={faSun} />
				<span>Light</span>
			</p>
		),
	},
	{
		value: 'dark',
		children: (
			<p className='space-x-12'>
				<FontAwesomeIcon icon={faMoon} />
				<span>Dark</span>
			</p>
		),
	},
	{
		value: 'system',
		children: (
			<p className='space-x-12'>
				<FontAwesomeIcon icon={faWandMagicSparkles} />
				<span>System</span>
			</p>
		),
	},
]

export default async function ThemeModal() {
	'use cache'
	return <ThemeSelect themeOptions={themeOptions} />
}
