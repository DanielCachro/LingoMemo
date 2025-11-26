import {Metadata} from 'next'
import InfoPageLayout from '../_components/InfoPageLayout'

export const metadata: Metadata = {
	title: 'Credits - LingoMemo',
	description: 'Credits and attributions for resources used in LingoMemo.',
}

export default function CreditsPage() {
	return (
		<InfoPageLayout title='Credits'>
			<div className='space-y-24 text-lg text-background-700 dark:text-background-300'>
				<section>
					<h2 className='mb-12 text-2xl font-bold text-background-900 dark:text-background-100'>Icons</h2>
					<p>
						Icons used in this project are provided by{' '}
						<a
							href='https://fontawesome.com/'
							target='_blank'
							rel='noopener noreferrer'
							className='font-bold text-primary-500 hover:underline dark:text-primary-600'>
							FontAwesome
						</a>
						.
					</p>
				</section>

				<section>
					<h2 className='mb-12 text-2xl font-bold text-background-900 dark:text-background-100'>Illustrations</h2>
					<p>
						Cat illustrations are provided by <span className='italic'>[Artist Name/Source]</span>.
					</p>
				</section>

				<section>
					<h2 className='mb-12 text-2xl font-bold text-background-900 dark:text-background-100'>Tech Stack</h2>
					<ul className='list-inside list-disc space-y-4'>
						<li>Next.js</li>
						<li>Tailwind CSS</li>
						<li>Prisma</li>
						<li>Framer Motion</li>
					</ul>
				</section>
			</div>
		</InfoPageLayout>
	)
}
