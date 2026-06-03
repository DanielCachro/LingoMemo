import Form from '@/components/ProfileCreation/SelfStudyProfileForm'

export default async function CreateSelfStudyProfileModal() {
	'use cache'
	return <Form className='sm:gap-128' redirectTo='/preferences/learning-profile' />
}
