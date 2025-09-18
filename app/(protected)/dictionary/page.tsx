import {getCurrentUser} from '@/lib/actions/user'
import {cn} from '@/lib/utils'
import Image from 'next/image'
import Entry from './_components/Entry'
import SearchBarWrapper from './_components/SearchBarWrapper'
import type {DictionaryEntry, NotFoundEntry} from './_lib/types'

interface Props {
	searchParams?: Promise<{search: string}>
}

async function fetchAudioUrls(search: string) {
	if (!search) return []

	try {
		const result = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${search}`)
		if (!result.ok) throw new Error('Failed to fetch audio URLs')
		const data = await result.json()
		const audioUrls = data[0].phonetics
			.map((phonetic: {audio?: string}) => phonetic.audio)
			.filter((audio: string | undefined) => audio)
		return audioUrls
	} catch {
		return []
	}
}

async function fetchEntry(search: string): Promise<DictionaryEntry | NotFoundEntry> {
	const user = await getCurrentUser()
	const target_lang = user?.activeLearningProfile?.targetLang || 'en'
	
	try {
		const result = await fetch(`https://freedictionaryapi.com/api/v1/entries/${target_lang}/${search}`)

		if (!result.ok) {
			return {notFound: true, word: search}
		} else {
			const data = await result.json()

			if (data.entries.length <= 0) {
				return {notFound: true, word: search}
			}

			let audio: string[] = []
			if (target_lang === 'en') {
				audio = await fetchAudioUrls(search)
			}

			return {
				word: data.word,
				phonetic: data.entries
					.flatMap((e: {pronunciations?: {text?: string}[]}) => e.pronunciations ?? [])
					.find((p: {text?: string}) => p.text)?.text,
				audio: audio,
				senses: data.entries.map(
					(entry: {
						partOfSpeech?: string
						senses?: {definition?: string; examples?: string[]; synonyms?: string[]}[]
						synonyms?: string[]
					}) => ({
						partOfSpeech: entry.partOfSpeech,
						definitions: entry.senses?.map(sense => ({
							definition: sense.definition,
							examples: sense.examples,
							synonyms: sense.synonyms,
						})),
						synonyms: entry.synonyms,
					}),
				),
				source: {
					license: {
						name: data.source.license.name,
						url: data.source.license.url,
					},
					url: data.source.url,
				},
			}
		}
	} catch {
		throw new Error('Failed to fetch dictionary entry')
	}
}

export default async function DictionaryPage({searchParams}: Props) {
	const params = await searchParams
	const search = params?.search
	let entry: DictionaryEntry | NotFoundEntry = {notFound: true, word: ''}

	if (search) {
		entry = await fetchEntry(search)
	}

	return (
		<section className='flex h-full flex-col items-center px-16 page-padding-y'>
			<div
				className={cn('flex h-full w-full max-w-640 flex-col', {
					'space-y-48': search,
				})}>
				<SearchBarWrapper />
				{search && <Entry entry={entry} />}
				{!search && (
					<div className='flex grow flex-col items-center justify-center space-y-32 text-center'>
						<Image src='/cats/CatWow.svg' alt='Brand cat smiling' width={120} height={112} priority className='w-128' />
						<p>
							Looking for a new word? <br /> Search above and turn it into a flashcard!
						</p>
					</div>
				)}
			</div>
		</section>
	)
}
