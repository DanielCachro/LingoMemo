export interface DictionaryDefinition {
	word: string
	phonetic: string
	audio: string[]
	meanings: {
		partOfSpeech: string
		definitions: [
			{
				definition: string
				example: string
				synonyms: string[]
			},
		]
		synonyms: string[]
	}[]
}

export interface NotFoundDefinition {
	notFound: true
	word: string
}
