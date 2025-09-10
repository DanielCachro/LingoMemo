import {faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Link from 'next/link'

export default function ProgressBar() {
	const value = 60
	const max = 100
	const percent = (value / max) * 100

	return (
		<div className='flex w-full items-center gap-12'>
			<Link href='/home' className='hover:cursor-pointer'>
				<FontAwesomeIcon icon={faChevronLeft} />
			</Link>
			<div className='relative h-8 grow overflow-hidden rounded-full bg-background-200 dark:bg-background-800'>
				<div
					className='h-full rounded-full bg-primary-500 transition-all dark:bg-primary-600'
					style={{width: `${percent}%`}}></div>
			</div>
			<p>9/48</p>
		</div>
	)
}
