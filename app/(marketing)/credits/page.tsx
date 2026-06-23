import {Metadata} from 'next'
import InfoPageLayout from '../_components/InfoPageLayout'
import Section from './Section'

export const metadata: Metadata = {
	title: 'Credits - LingoMemo',
	description: 'Credits and attributions for resources used in LingoMemo.',
	alternates: {
		canonical: '/credits',
	},
}

const ulClassName = 'ml-16 list-inside list-disc space-y-4'

export default function CreditsPage() {
	return (
		<InfoPageLayout title='Credits'>
			<div className='space-y-24 text-lg text-background-700 dark:text-background-300'>
				<Section title='Icons'>
					<ul className={ulClassName}>
						<li>
							Most icons used in this project are provided by{' '}
							<a
								href='https://fontawesome.com/'
								target='_blank'
								rel='noopener noreferrer'
								className='font-bold text-primary-500 hover:underline dark:text-primary-600'>
								FontAwesome
							</a>
							.
						</li>
						<li>
							Some icons used in this project are provided by{' '}
							<a
								href='https://feathericons.com/'
								target='_blank'
								rel='noopener noreferrer'
								className='font-bold text-primary-500 hover:underline dark:text-primary-600'>
								Feather Icons
							</a>{' '}
							by Cole Bemis.
						</li>
					</ul>
				</Section>
				<Section title='Illustrations'>
					<p>
						Cat illustrations and landing page images are designed by{' '}
						<a
							href='https://www.magnific.com/'
							target='_blank'
							rel='noopener noreferrer'
							className='font-bold text-primary-500 hover:underline dark:text-primary-600'>
							Magnific
						</a>
						.
					</p>
				</Section>
				<Section title='Sounds'>
					<p>
						Sound effects obtained from{' '}
						<a
							href='https://www.zapsplat.com'
							target='_blank'
							rel='noopener noreferrer'
							className='font-bold text-primary-500 hover:underline dark:text-primary-600'>
							zapsplat.com
						</a>
						.
					</p>
				</Section>
				<Section title='Patterns'>
					<p>
						Background patterns are provided by{' '}
						<a
							href='https://heropatterns.com/'
							target='_blank'
							rel='noopener noreferrer'
							className='font-bold text-primary-500 hover:underline dark:text-primary-600'>
							Hero Patterns
						</a>{' '}
						by Steve Schoger.
					</p>
				</Section>
				<Section title='Dictionary Data'>
					<ul className={ulClassName}>
						<li>
							Dictionary data is provided by{' '}
							<a
								href='https://freedictionaryapi.com/'
								target='_blank'
								rel='noopener noreferrer'
								className='font-bold text-primary-500 hover:underline dark:text-primary-600'>
								Free Dictionary API
							</a>
							. Content is sourced from{' '}
							<a
								href='https://en.wiktionary.org/'
								target='_blank'
								rel='noopener noreferrer'
								className='font-bold text-primary-500 hover:underline dark:text-primary-600'>
								Wiktionary
							</a>{' '}
							under the{' '}
							<a
								href='https://creativecommons.org/licenses/by-sa/4.0/'
								target='_blank'
								rel='noopener noreferrer'
								className='font-bold text-primary-500 hover:underline dark:text-primary-600'>
								CC BY-SA 4.0
							</a>{' '}
							license.
						</li>
						<li>
							Audio pronunciations are provided by{' '}
							<a
								href='https://dictionaryapi.dev/'
								target='_blank'
								rel='noopener noreferrer'
								className='font-bold text-primary-500 hover:underline dark:text-primary-600'>
								Free Dictionary API (dictionaryapi.dev)
							</a>
							.
						</li>
					</ul>
				</Section>
				<Section title='Typography'>
					<p>
						<span className='font-bold'>Nunito</span> font is provided by{' '}
						<a
							href='https://fonts.google.com/specimen/Nunito'
							target='_blank'
							rel='noopener noreferrer'
							className='font-bold text-primary-500 hover:underline dark:text-primary-600'>
							Google Fonts
						</a>{' '}
						under the{' '}
						<a
							href='https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL'
							target='_blank'
							rel='noopener noreferrer'
							className='font-bold text-primary-500 hover:underline dark:text-primary-600'>
							Open Font License
						</a>
						.
					</p>
				</Section>
				<Section title='Tech Stack'>
					<ul className={ulClassName}>
						<li>Next.js</li>
						<li>TypeScript</li>
						<li>Tailwind CSS</li>
						<li>Supabase</li>
						<li>Prisma</li>
						<li>TanStack Query</li>
						<li>Headless UI</li>
						<li>Framer Motion</li>
						<li>Zod</li>
						<li>Lodash</li>
						<li>Luxon</li>
						<li>CLSX</li>
						<li>Tailwind Merge</li>
						<li>React Toastify</li>
						<li>Next Themes</li>
					</ul>
				</Section>
			</div>
		</InfoPageLayout>
	)
}
