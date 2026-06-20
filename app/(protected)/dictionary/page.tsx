import {cn} from '@/lib/utils/cn'
import {Metadata} from 'next'
import Image from 'next/image'
import {redirect} from 'next/navigation'
import EntryLoader from './_components/EntryLoader'
import SearchBarWrapper from './_components/SearchBarWrapper'
import {getTargetLang} from './_lib/actions'

export async function generateMetadata({searchParams}: Props): Promise<Metadata> {
	const params = await searchParams
	const search = params?.search?.toLowerCase().trim()

	if (search) {
		return {
			title: `${search} - Dictionary - LingoMemo`,
			description: `Definition for the word ${search}.`,
		}
	}

	return {
		title: 'Dictionary - LingoMemo',
		description: 'Browse dictionary entries and create flashcards with just one click.',
	}
}

interface Props {
	searchParams?: Promise<{search: string; lang: string}>
}

export default async function DictionaryPage({searchParams}: Props) {
	const params = await searchParams
	const search = params?.search?.toLowerCase().trim()
	const lang = params?.lang

	let targetLang = ''
	if (!lang) {
		const userTargetLang = await getTargetLang()
		if (!userTargetLang) redirect('/home')
		targetLang = userTargetLang
	} else {
		targetLang = lang
	}

	return (
		<section className='flex h-full flex-col items-center px-16 page-padding-y'>
			<div
				className={cn('flex h-full w-full max-w-640 flex-col', {
					'space-y-48': search,
				})}>
				<SearchBarWrapper targetLang={targetLang} />
				{search && <EntryLoader search={search} targetLang={targetLang} />}
				{!search && (
					<div className='flex grow flex-col items-center justify-center space-y-32 text-center'>
						<Image
							src='/cats/CatWow.svg'
							alt='Brand cat smiling'
							width={120}
							height={112}
							priority
							className='w-128'
							aria-hidden='true'
						/>
						<p>
							Looking for a new word? <br /> Search above and turn it into a flashcard!
						</p>
					</div>
				)}
			</div>
		</section>
	)
}
