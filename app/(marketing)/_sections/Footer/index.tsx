import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
	return (
		<footer className='py-48'>
			<div className='max-w-7xl mx-auto flex flex-col items-center justify-between gap-24 px-24 md:flex-row md:px-48'>
				<div className='flex items-center gap-8 md:flex-1'>
					<Image src='/cats/CatSmile.svg' alt='LingoMemo Logo' width={120} height={112} className='h-24 w-24' />
					<span className='font-bold text-background-700 dark:text-background-300'>LingoMemo</span>
				</div>
				<div className='text-sm text-background-500'>
					&copy; {new Date().getFullYear()} LingoMemo. All rights reserved.
				</div>
				<div className='relative flex gap-24 md:flex-1 md:justify-end'>
					<Link href='/privacy' className='text-background-500 hover:text-primary-500 dark:hover:text-primary-600'>
						Privacy Policy
					</Link>

					<Link href='/credits' className='text-background-500 hover:text-primary-500 dark:hover:text-primary-600'>
						Credits
					</Link>
					<Link href='/terms' className='text-background-500 hover:text-primary-500 dark:hover:text-primary-600'>
						Terms
					</Link>
				</div>
			</div>
		</footer>
	)
}
