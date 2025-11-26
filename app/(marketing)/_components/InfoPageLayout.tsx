import SlabBorder from '@/components/SlabBorder'
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Link from 'next/link'

export default function InfoPageLayout({title, children}: {title: string; children: React.ReactNode}) {
	return (
		<div className='flex min-h-[calc(100vh-7.5rem)] flex-col'>
			<div className='grow pt-128 pb-48'>
				<div className='mx-auto max-w-1440 px-24 md:px-48'>
					<Link
						href='/'
						className='mb-32 inline-flex items-center gap-8 text-sm font-bold text-background-600 hover:text-primary-500 dark:text-background-400 dark:hover:text-primary-600'>
						<FontAwesomeIcon icon={faArrowLeft} />
						Back to Home
					</Link>

					<h1 className='mb-32 text-4xl font-black'>{title}</h1>

					<SlabBorder rounded='xl' borderSize='sm' slabSize='md' className='p-32'>
						{children}
					</SlabBorder>
				</div>
			</div>
		</div>
	)
}
