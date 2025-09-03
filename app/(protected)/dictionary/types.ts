export interface DictionaryEntry {
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

export interface NotFoundEntry {
	notFound: true
	word: string
}
