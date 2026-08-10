import {cacheLife} from 'next/cache'
import type {DictionaryEntry, NotFoundEntry} from '../_lib/types'
import Entry from './Entry'

async function fetchAudioUrls(search: string) {
	'use cache'
	cacheLife('max')

	if (!search) return []

	const result = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${search}`)

	if (!result.ok) {
		// if the word is not found, return an empty array instead of throwing an error
		if (result.status === 404) {
			return []
		}

		// if it's a server error (e.g., 502 Cloudflare) throw an error
		// thanks to that Next.js won't cache the result and will retry on the next request
		throw new Error('Dictionary API is currently unavailable.')
	}

	// Safely parse the JSON response and extract audio URLs, filtering out any undefined values
	const data = await result.json()
	const audioUrls =
		data[0]?.phonetics
			?.map((phonetic: {audio?: string}) => phonetic.audio)
			?.filter((audio: string | undefined) => audio) || []

	return audioUrls
}

async function fetchEntry(search: string, targetLang: string): Promise<DictionaryEntry | NotFoundEntry> {
	'use cache'
	cacheLife('max')
	try {
		const result = await fetch(`https://freedictionaryapi.com/api/v1/entries/${targetLang}/${search}`)

		if (!result.ok) {
			return {notFound: true, word: search}
		} else {
			const data = await result.json()

			if (data.entries.length <= 0) {
				return {notFound: true, word: search}
			}

			let audio: string[] = []
			if (targetLang === 'en') {
				audio = await fetchAudioUrls(search)
			}

			return {
				entryLang: targetLang,
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

interface Props {
	search: string
	targetLang: string
}

export default async function EntryLoader({search, targetLang}: Props) {
	const entry = await fetchEntry(search, targetLang)
	return <Entry entry={entry} />
}
