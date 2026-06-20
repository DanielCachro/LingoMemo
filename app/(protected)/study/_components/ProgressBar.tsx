import {cn} from '@/lib/utils/cn'
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Link from 'next/link'

interface Props {
	value: number
	max: number
}

export default function ProgressBar({value, max}: Props) {
	const percent = (value / max) * 100

	return (
		<div className='flex w-full items-center gap-12'>
			<Link href='/home' className='hover:cursor-pointer'>
				<FontAwesomeIcon icon={faChevronLeft} />
			</Link>
			<div className='relative h-8 grow overflow-hidden rounded-full bg-background-200 dark:bg-background-800'>
				<div
					className={cn('h-full rounded-full bg-primary-500 transition-all dark:bg-primary-600', {
						'bg-success-500 dark:bg-success-600': percent === 100,
					})}
					style={{width: `${percent}%`}}></div>
			</div>
			<p>
				{value}/{max}
			</p>
		</div>
	)
}

export function Skeleton() {
	return (
		<div className='flex w-full items-center gap-12 pt-8'>
			<div className='h-16 w-16 rounded-full bg-skeleton'></div>
			<div className='relative h-8 grow rounded-full bg-skeleton'></div>
			<div className='h-16 w-32 rounded-full bg-skeleton'></div>
		</div>
	)
}
