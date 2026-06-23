import Form from '@/components/ProfileCreation/LanguageProfileForm'
import {Metadata} from 'next'

export const metadata: Metadata = {
	title: 'Setup - Language Profile Creation - LingoMemo',
	description: 'Create your first language profile to get started with LingoMemo.',
}

export default function CreateLanguageProfile() {
	return <Form className='gap-24' redirectTo='/home' />
}
