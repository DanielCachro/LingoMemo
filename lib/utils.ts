import {TargetLanguages} from '@prisma/client'
import {ClassValue, clsx} from 'clsx'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function languageCodeToName(languageCode: TargetLanguages, displayLanguage: string = 'en') {
	try {
		const languageNamer = new Intl.DisplayNames([displayLanguage], {
			type: 'language',
		})

		const fullName = languageNamer.of(languageCode)

		if (!fullName) {
			return `${languageCode.toUpperCase()}`
		}

		return `${fullName}`
	} catch (error) {
		throw new Error(`Failed to format language name. ${(error as Error).message}`)
	}
}
