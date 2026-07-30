import {flashcardFieldsLimits, flashcardFormSchema} from './schema'

describe('flashcardFormSchema', () => {
	it('should pass with valid data', () => {
		const validPayload = {
			question: 'Brave',
			answer: 'Ready to face danger or pain; showing courage.',
			note: 'A basic adjective used to describe someone who is not afraid.',
			phonetic: '/breɪv/',
			synonyms: ['courageous', 'fearless', 'bold'],
			examples: ['The brave firefighter rescued the cat from the burning tree.'],
		}

		const parsed = flashcardFormSchema.safeParse(validPayload)

		expect(parsed.success).toBe(true)
	})

	it('should pass with only required fields', () => {
		const minimalPayload = {
			question: 'Brave',
			answer: 'Ready to face danger or pain; showing courage.',
		}

		const parsed = flashcardFormSchema.safeParse(minimalPayload)

		expect(parsed.success).toBe(true)
	})

	it('should fail when answer exceeds the maximum length limit', () => {
		const invalidPayload = {
			question: 'Valid question',
			answer: 'a'.repeat(flashcardFieldsLimits.answer.max + 1),
		}

		const parsed = flashcardFormSchema.safeParse(invalidPayload)

		expect(parsed.success).toBe(false)
		if (!parsed.success) {
			const answerError = parsed.error.issues.find(issue => issue.path.includes('answer'))
			expect(answerError?.message).toBe(`Answer must be no longer than ${flashcardFieldsLimits.answer.max} characters`)
		}
	})

	it.each([
		{description: 'missing (undefined)', synonyms: undefined, examples: undefined},
		{description: 'null', synonyms: null, examples: null},
		{description: 'empty string', synonyms: '', examples: ''},
	])('should default to empty arrays when array fields are $description', ({synonyms, examples}) => {
		const payload = {
			question: 'Brave',
			answer: 'Ready to face danger or pain; showing courage.',
			synonyms,
			examples,
		}

		const parsed = flashcardFormSchema.safeParse(payload)

		expect(parsed.success).toBe(true)
		if (parsed.success) {
			expect(parsed.data.synonyms).toEqual([])
			expect(parsed.data.examples).toEqual([])
		}
	})

	describe('should fail and return specific message when', () => {
		it('question is empty', () => {
			const invalidPayload = {
				question: '',
				answer: 'Ready to face danger or pain; showing courage.',
			}

			const parsed = flashcardFormSchema.safeParse(invalidPayload)

			expect(parsed.success).toBe(false)
			if (!parsed.success) {
				const questionError = parsed.error.issues.find(issue => issue.path.includes('question'))
				expect(questionError?.message).toBe('Question is required')
			}
		})

		it('question is missing', () => {
			const invalidPayload = {
				answer: 'Ready to face danger or pain; showing courage.',
			}

			const parsed = flashcardFormSchema.safeParse(invalidPayload)

			expect(parsed.success).toBe(false)
			if (!parsed.success) {
				const questionError = parsed.error.issues.find(issue => issue.path.includes('question'))
				expect(questionError?.message).toBe('Question is required')
			}
		})

		it('question is wrong type', () => {
			const invalidPayload = {
				question: 123,
				answer: 'Ready to face danger or pain; showing courage.',
			}

			const parsed = flashcardFormSchema.safeParse(invalidPayload)

			expect(parsed.success).toBe(false)
			if (!parsed.success) {
				const questionError = parsed.error.issues.find(issue => issue.path.includes('question'))
				expect(questionError?.message).toBe('Question must be a string')
			}
		})
	})

	describe('JSON string parsing for array fields', () => {
		it('should parse valid JSON strings into arrays for synonyms and examples', () => {
			const payload = {
				question: 'Brave',
				answer: 'Ready to face danger or pain; showing courage.',
				synonyms: JSON.stringify(['courageous', 'fearless']),
				examples: JSON.stringify(['A brave heart.']),
			}

			const parsed = flashcardFormSchema.safeParse(payload)

			expect(parsed.success).toBe(true)
			if (parsed.success) {
				expect(parsed.data.synonyms).toEqual(['courageous', 'fearless'])
				expect(parsed.data.examples).toEqual(['A brave heart.'])
			}
		})

		it('should fail when synonyms is an invalid JSON string', () => {
			const payload = {
				question: 'Brave',
				answer: 'Ready to face danger or pain; showing courage.',
				synonyms: 'invalid-json-[',
			}

			const parsed = flashcardFormSchema.safeParse(payload)

			expect(parsed.success).toBe(false)
			if (!parsed.success) {
				const error = parsed.error.issues.find(issue => issue.path.includes('synonyms'))
				expect(error?.message).toBe('Synonyms must be a valid JSON array')
			}
		})

		it('should fail when synonyms is a JSON string representing an object instead of an array', () => {
			const payload = {
				question: 'Brave',
				answer: 'Ready to face danger or pain; showing courage.',
				synonyms: JSON.stringify({key: 'value'}),
			}

			const parsed = flashcardFormSchema.safeParse(payload)

			expect(parsed.success).toBe(false)
			if (!parsed.success) {
				const error = parsed.error.issues.find(issue => issue.path.includes('synonyms'))
				expect(error?.message).toBe('Synonyms must be a valid JSON array')
			}
		})

		it('should fail when an element inside the JSON array exceeds character limits', () => {
			const longSynonym = 'a'.repeat(flashcardFieldsLimits.synonym.max + 1)
			const payload = {
				question: 'Brave',
				answer: 'Ready to face danger or pain; showing courage.',
				synonyms: JSON.stringify([longSynonym]),
			}

			const parsed = flashcardFormSchema.safeParse(payload)

			expect(parsed.success).toBe(false)
			if (!parsed.success) {
				const error = parsed.error.issues.find(issue => issue.path.includes('synonyms'))
				expect(error?.message).toBe(`Synonym must be no longer than ${flashcardFieldsLimits.synonym.max} characters`)
			}
		})
	})
})
