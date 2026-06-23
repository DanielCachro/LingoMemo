import Form from '@/components/ProfileCreation/SelfStudyProfileForm'
import {Metadata} from 'next'

export const metadata: Metadata = {
	title: 'Setup - Self-Study Profile Creation - LingoMemo',
	description: 'Create your first self-study profile to get started with LingoMemo.',
}

export default function CreateSelfStudyProfile() {
	return <Form className='gap-24' redirectTo='/home' />
}
