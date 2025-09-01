import Definition from './Definition'
import SearchBarWrapper from './SearchBarWrapper'
import type {DictionaryDefinition, NotFoundDefinition} from './types'

interface Props {
	searchParams?: Promise<{search: string}>
}

export default async function DictionaryPage({searchParams}: Props) {
	const params = await searchParams
	const search = params?.search
	let definition: DictionaryDefinition | NotFoundDefinition = {notFound: true, word: ''}

	if (search) {
		try {
			const result = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${search}`)

			if (!result.ok) {
				definition.word = search
			} else {
				const data = await result.json()

				definition = {
					word: data[0].word,
					phonetic: data[0].phonetic || data[0].phonetics.find((phonetic: {text?: string}) => phonetic.text)?.text,
					audio: data[0].phonetics
						.map((phonetic: {audio?: string}) => phonetic.audio)
						.filter((audio: string | undefined) => audio),
					meanings: data[0].meanings,
				}
			}
		} catch {
			throw new Error('Failed to fetch definition')
		}
	}

	return (
		<section className='flex flex-col items-center px-16'>
			<div className='w-full max-w-640 space-y-48'>
				<SearchBarWrapper />
				<Definition definition={definition} />
			</div>
		</section>
	)
}
