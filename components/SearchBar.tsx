import {cn} from '@/lib/utils'
import {faSearch} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {FormEvent} from 'react'
import Input from './Form/Input'

interface Props {
	className?: string
	placeholder?: string
	formAction?: (formData: FormData) => void | Promise<void>
	onSubmit?: (event: FormEvent<HTMLFormElement>) => void | Promise<void>
	onChange?: (event: FormEvent<HTMLInputElement>) => void | Promise<void>
}

export default function SearchBar({className, placeholder, formAction, onSubmit, onChange}: Props) {
	return (
		<search
			className={cn(
				'rounded-sm border-2 border-background-300 bg-background-50 focus-within:border-background-400 dark:border-background-700 dark:bg-background-900 dark:focus-within:border-background-600',
				className,
			)}>
			<form className='flex' action={formAction} onSubmit={onSubmit}>
				<button tabIndex={-1} type='submit' className='pr-12 pl-16 text-background-400'>
					<FontAwesomeIcon icon={faSearch} />
				</button>
				<Input
					type='search'
					name='search'
					placeholder={placeholder || 'Search...'}
					autoComplete='off'
					autoCorrect='off'
					autoCapitalize='none'
					spellCheck='false'
					className='border-0 pl-0 [&::-webkit-search-cancel-button]:appearance-none'
					onChange={onChange}
				/>
			</form>
		</search>
	)
}

export function Skeleton() {
	return (
		<div role='status' className='flex w-full max-w-640 items-center gap-16 rounded-sm bg-skeleton p-16'>
			<div className='h-24 w-24 animate-pulse rounded-full bg-skeleton-accent' />
			<div className='h-8 grow animate-pulse rounded-full bg-skeleton-accent' />
		</div>
	)
}
