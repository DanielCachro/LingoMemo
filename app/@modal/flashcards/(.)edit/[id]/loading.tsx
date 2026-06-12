import {Skeleton as CreateEditModalSkeleton} from '../../_components/CreateEditModal'

export default function Loading() {
	return (
		<CreateEditModalSkeleton
			title='Edit Flashcard'
			subtitle='Make changes to your flashcard below.'
			disableAnimations={{disableExitAnimation: true}}
		/>
	)
}
