import {SourceLanguages, TargetLanguages} from '@/lib/generated/prisma/browser'
import {languageCodeToName} from '@/lib/utils'
import Form from './Form'

const sourceLanguages = Object.values(SourceLanguages).map(lang => ({
	value: lang,
	label: languageCodeToName(lang),
}))

const targetLanguages = Object.values(TargetLanguages).map(lang => ({
	value: lang,
	label: languageCodeToName(lang),
}))

export default function CreateLanguageProfileModal() {
	return <Form sourceLanguages={sourceLanguages} targetLanguages={targetLanguages} />
}
