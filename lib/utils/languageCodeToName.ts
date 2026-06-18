import {TargetLanguages} from '@/lib/generated/prisma/browser'

const unresolvedLanguageNames = new Map([
	['ang', 'Old English'],
	['mul', 'Translingual'],
])

export function languageCodeToName(languageCode: TargetLanguages, displayLanguage: string = 'en') {
	try {
		const languageNamer = new Intl.DisplayNames([displayLanguage], {
			type: 'language',
		})

		const fullName = languageNamer.of(languageCode)

		if (!fullName || fullName === languageCode) {
			return unresolvedLanguageNames.has(languageCode)
				? unresolvedLanguageNames.get(languageCode)!
				: `${languageCode.toUpperCase()}`
		}

		return `${fullName}`
	} catch (error) {
		throw new Error(`Failed to format language name. ${(error as Error).message}`)
	}
}
