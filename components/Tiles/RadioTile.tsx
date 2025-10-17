import {cn} from '@/lib/utils'
import {ChangeEventHandler} from 'react'

interface RadioTileProps {
	children: React.ReactNode
	name: string
	value: string
	checked: boolean
	onChange: ChangeEventHandler<HTMLInputElement>
}

export default function RadioTile({children, name, value, checked, onChange}: RadioTileProps) {
	return (
		<label
			className={cn(
				'rounded-sm border-2 border-background-300 p-16 transition-colors duration-100 pointer-fine:hover:cursor-pointer pointer-fine:hover:border-primary-300 pointer-fine:hover:bg-primary-100 dark:border-background-700 dark:pointer-fine:hover:border-primary-600 dark:pointer-fine:hover:bg-primary-400',
				{
					'border-primary-400 bg-primary-200 dark:border-primary-700 dark:bg-primary-500': checked,
				},
			)}>
			<input type='radio' name={name} value={value} checked={checked} onChange={onChange} className='hidden' />
			{children}
		</label>
	)
}
