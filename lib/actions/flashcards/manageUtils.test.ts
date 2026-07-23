import {flashcardFieldsLimits, flashcardFormSchema} from '../../flashcards/schema'
import {formatFlashcardErrors, parseAndValidateFlashcard} from './manageUtils'

describe('formatFlashcardErrors', () => {
	it('should format standard string field errors correctly', () => {
		const result = flashcardFormSchema.safeParse({
			question: '',
			answer: 'Valid answer',
		})

		expect(result.success).toBe(false)

		if (!result.success) {
			const formattedErrors = formatFlashcardErrors(result.error)

			expect(formattedErrors.question).toBeDefined()
			expect(typeof formattedErrors.question).toBe('string')
			// Return undefined for fields without errors
			expect(formattedErrors.answer).toBeUndefined()
		}
	})

	it('should format array field errors (synonyms, examples) with specific indexes', () => {
		const result = flashcardFormSchema.safeParse({
			question: 'Valid question',
			answer: 'Valid answer',
			synonyms: [
				'valid',
				'a'.repeat(flashcardFieldsLimits.synonym.max + 1),
				'b'.repeat(flashcardFieldsLimits.synonym.max + 1),
			], // Second and Third element (index 1 and 2) are too long
			examples: ['a'.repeat(flashcardFieldsLimits.example.max + 1)], // First element (index 0) is too long
		})

		expect(result.success).toBe(false)

		if (!result.success) {
			const formattedErrors = formatFlashcardErrors(result.error)

			expect(Array.isArray(formattedErrors.synonyms)).toBe(true)
			expect(formattedErrors.synonyms).toHaveLength(2)
			expect(formattedErrors.synonyms![0].index).toBe(1)
			expect(formattedErrors.synonyms![1].index).toBe(2)

			expect(Array.isArray(formattedErrors.examples)).toBe(true)
			expect(formattedErrors.examples).toHaveLength(1)
			expect(formattedErrors.examples![0].index).toBe(0)
		}
	})
})

describe('parseAndValidateFlashcard', () => {
	it('should return success and parsed data for valid FormData', () => {
		const formData = new FormData()
		formData.append('question', 'Brave')
		formData.append('answer', 'Ready to face danger or pain; showing courage.')
		formData.append('note', 'Important note')
		formData.append('phonetic', '/breɪv/')
		formData.append('synonyms', JSON.stringify(['courageous', 'fearless', 'bold']))
		formData.append('examples', JSON.stringify(['The brave firefighter rescued the cat from the burning tree.']))

		const parsed = parseAndValidateFlashcard(formData)

		expect(parsed.success).toBe(true)
		if (parsed.success) {
			expect(parsed.data.question).toBe('Brave')
			expect(parsed.data.answer).toBe('Ready to face danger or pain; showing courage.')
			expect(parsed.data.note).toBe('Important note')
			expect(parsed.data.phonetic).toBe('/breɪv/')
			expect(parsed.data.synonyms).toEqual(['courageous', 'fearless', 'bold'])
			expect(parsed.data.examples).toEqual(['The brave firefighter rescued the cat from the burning tree.'])
		}
	})

	it('should handle missing array fields by defaulting to empty arrays', () => {
		const formData = new FormData()
		formData.append('question', 'Brave')
		formData.append('answer', 'Ready to face danger or pain; showing courage.')
		// Not appending synonyms and examples to simulate missing fields

		const parsed = parseAndValidateFlashcard(formData)

		expect(parsed.success).toBe(true)
		if (parsed.success) {
			expect(parsed.data.synonyms).toEqual([])
			expect(parsed.data.examples).toEqual([])
		}
	})

	it('should return validation error when array field is an invalid JSON string', () => {
		const formData = new FormData()
		formData.append('question', 'Brave')
		formData.append('answer', 'Ready to face danger or pain; showing courage.')
		formData.append('synonyms', 'invalid-json-[') // Broken JSON string to simulate invalid input

		const parsed = parseAndValidateFlashcard(formData)

		expect(parsed.success).toBe(false)
		if (!parsed.success) {
			expect(parsed.errorState.errors.synonyms).toBeDefined()
			expect(parsed.errorState.errors.synonyms?.[0]?.message).toContain('Synonyms must be a valid JSON array')
		}
	})

	it('should return validation error when array field is a JSON string representing an object', () => {
		const formData = new FormData()
		formData.append('question', 'Brave')
		formData.append('answer', 'Ready to face danger or pain; showing courage.')
		formData.append('synonyms', JSON.stringify({key: 'value'})) // Wrong type: object instead of array

		const parsed = parseAndValidateFlashcard(formData)

		expect(parsed.success).toBe(false)
		if (!parsed.success) {
			expect(parsed.errorState.errors.synonyms).toBeDefined()
		}
	})

	it('should return errorState when form validation fails', () => {
		const formData = new FormData()
		formData.append('question', '') // Invalid: empty question
		formData.append('answer', 'Ready to face danger or pain; showing courage.')

		const parsed = parseAndValidateFlashcard(formData)

		expect(parsed.success).toBe(false)
		if (!parsed.success) {
			expect(parsed.errorState.status).toBe('error')
			expect(parsed.errorState.message).toBe('Validation failed. Please correct the errors and try again.')
			expect(parsed.errorState.errors.question).toBeDefined()
		}
	})

	it('should handle missing or empty answer field correctly', () => {
		const formData = new FormData()
		formData.append('question', 'Brave')

		const parsed = parseAndValidateFlashcard(formData)

		expect(parsed.success).toBe(false)
		if (!parsed.success) {
			expect(parsed.errorState.errors.answer).toBeDefined()
		}
	})
})
