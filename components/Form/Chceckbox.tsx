import {cn} from '@/lib/utils'
import {Field, Checkbox as HeadlessCheckbox, Label} from '@headlessui/react'

interface Props {
	checked?: boolean
	onChange?: (checked: boolean) => void
	name?: string
	defaultChecked?: boolean
	className?: string
	label?: string
}

export default function Checkbox({checked, onChange, name, className, label, defaultChecked}: Props) {
	const CheckboxToRender = (
		<HeadlessCheckbox
			checked={checked}
			onChange={onChange}
			name={name}
			defaultChecked={defaultChecked}
			className={cn(
				'group block size-16 rounded-full border border-background-300 bg-background-100 transition-colors duration-150 peer-hover:border-primary-400 peer-hover:bg-primary-300 hover:cursor-pointer hover:border-primary-400 hover:bg-primary-300 focus-visible:outline-background-400 data-checked:border-primary-500 data-checked:bg-primary-500 data-checked:peer-hover:border-primary-400 data-checked:peer-hover:bg-primary-400 data-checked:hover:border-primary-400 data-checked:hover:bg-primary-400 dark:border-background-600 dark:bg-background-900 dark:peer-hover:border-primary-500 dark:peer-hover:bg-primary-400 dark:hover:border-primary-500 dark:hover:bg-primary-400 dark:focus-visible:outline-background-700 dark:data-checked:border-primary-600 dark:data-checked:bg-primary-600 dark:data-checked:peer-hover:border-primary-500 dark:data-checked:peer-hover:bg-primary-500 dark:data-checked:hover:border-primary-500 dark:data-checked:hover:bg-primary-500',
				className,
			)}>
			<svg
				className='stroke-background-100 p-[0.0625rem] opacity-0 group-data-checked:opacity-100'
				viewBox='0 0 14 14'
				fill='none'>
				<path d='M3 8L6 11L11 3.5' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />
			</svg>
		</HeadlessCheckbox>
	)

	return label ? (
		<Field className='flex w-fit flex-row-reverse items-center gap-8'>
			<Label className='peer text-base font-medium hover:cursor-pointer'>{label}</Label>
			{CheckboxToRender}
		</Field>
	) : (
		CheckboxToRender
	)
}
