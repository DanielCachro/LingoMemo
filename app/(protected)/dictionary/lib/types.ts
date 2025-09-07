export type DictionaryEntry = {
	word: string
	phonetic: string
	audio: string[]
	senses: {
		partOfSpeech: string
		definitions: [
			{
				definition: string
				examples: string[]
				synonyms: string[]
			},
		]
		synonyms: string[]
	}[]
	source: {
		license: {
			name: string
			url: string
		}
		url: string
	}
}

export type DictionaryDefinition = DictionaryEntry['senses'][0]['definitions'][0]

export type NotFoundEntry = {
	notFound: true
	word: string
}
