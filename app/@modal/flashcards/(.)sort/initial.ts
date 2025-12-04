export const initialFlashcardsSortOrder: {
	value: string
	label: string
	direction: 'asc' | 'desc'
}[] = [
	{value: 'createdAt', label: 'Creation Date', direction: 'desc'},
	{value: 'nextReviewDate', label: 'Next Review Date', direction: 'desc'},
	{value: 'question', label: 'Question', direction: 'asc'},
	{value: 'answer', label: 'Answer', direction: 'asc'},
	{value: 'efactor', label: 'eFactor', direction: 'desc'},
]
