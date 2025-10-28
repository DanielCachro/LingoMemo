import {Radio} from '@headlessui/react'

interface Props {
	children: React.ReactNode
	value: string
}

export default function RadioButton({children, value}: Props) {
	return (
		<Radio
			value={value}
			className='rounded-sm border-2 border-background-300 p-16 transition-colors duration-100 data-checked:border-primary-400 data-checked:bg-primary-200 dark:border-background-700 data-checked:dark:border-primary-700 data-checked:dark:bg-primary-500 pointer-fine:hover:cursor-pointer pointer-fine:hover:border-primary-300 pointer-fine:hover:bg-primary-100 dark:pointer-fine:hover:border-primary-600 dark:pointer-fine:hover:bg-primary-400'>
			{children}
		</Radio>
	)
}
