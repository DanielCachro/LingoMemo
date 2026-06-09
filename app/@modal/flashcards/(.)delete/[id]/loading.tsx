import {Skeleton} from '@/app/@modal/_components/ConfirmActionModal'

export default async function Loading() {
	'use cache'
	return <Skeleton heading='You are about to delete flashcard' />
}
