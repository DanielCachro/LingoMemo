import Form from '@/components/ProfileCreation/LanguageProfileForm'

export default async function CreateLanguageProfileModal() {
	'use cache'
	return <Form className='sm:gap-128' redirectTo='/preferences/learning-profile' />
}
