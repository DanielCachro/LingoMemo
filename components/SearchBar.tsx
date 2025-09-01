import {cn} from '@/lib/utils'
import {faSearch} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {FormEvent, HTMLAttributes} from 'react'

interface Props extends HTMLAttributes<HTMLElement> {
	className?: string
	formAction?: (formData: FormData) => void | Promise<void>
	onSubmit?: (event: FormEvent<HTMLFormElement>) => void | Promise<void>
}

export default function SearchBar({className, formAction, onSubmit}: Props) {
	return (
		<search
			className={cn(
				'rounded-sm border-2 border-background-300 bg-background-200 focus-within:border-background-400 dark:border-background-700 dark:bg-background-800 dark:focus-within:border-background-600',
				className,
			)}>
			<form className='flex' action={formAction} onSubmit={onSubmit}>
				<button tabIndex={-1} type='submit' className='pr-12 pl-16'>
					<FontAwesomeIcon icon={faSearch} />
				</button>
				<input
					type='search'
					name='search'
					placeholder='search'
					autoComplete='off'
					autoCorrect='off'
					autoCapitalize='off'
					spellCheck='false'
					className='w-full py-16 pr-16 placeholder-background-500 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none'
				/>
			</form>
		</search>
	)
}
