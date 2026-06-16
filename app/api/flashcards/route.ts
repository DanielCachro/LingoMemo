import {schema as flashcardsZodSchema, type FlashcardsFilter} from '@/app/@modal/flashcards/(.)filter/schema'
import {initialFlashcardsSortOrder} from '@/app/@modal/flashcards/(.)sort/initial'
import {type FlashcardsSort} from '@/app/@modal/flashcards/(.)sort/page'
import {getCurrentUser} from '@/lib/queries/user'
import {Prisma} from '@/lib/generated/prisma/client'
import {prisma} from '@/prisma/client'
import {NextRequest, NextResponse} from 'next/server'

export type FlashcardsApiResponse = {
	flashcards: Prisma.FlashcardGetPayload<{include: {answer: true}}>[]
	cursor?: number
}

export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser()
		if (!user) throw new Error('User not authenticated.')

		const activeLearningProfile = user.activeLearningProfile
		const activeLearningProfileId = user.activeLearningProfileId
		if (!activeLearningProfile || !activeLearningProfileId) throw new Error('No active learning profile found.')

		const searchParams = request.nextUrl.searchParams
		const limit = Math.min(Number(searchParams.get('limit') ?? 20), 100)
		const cursor = Number(searchParams.get('cursor'))

		const body = (await request.json()) as {
			searchTerm: string
			sort: FlashcardsSort | []
			filter: FlashcardsFilter | Record<string, never>
		}

		flashcardsZodSchema.parse(body.filter)

		const getOrderBy = (value: string, direction: 'asc' | 'desc'): Prisma.FlashcardOrderByWithRelationInput => {
			switch (value) {
				case 'nextReviewDate':
					return {nextReview: direction}
				case 'createdAt':
					return {createdAt: direction}
				case 'question':
					return {question: direction}
				case 'answer':
					return {answer: {text: direction}}
				case 'efactor':
					return {eFactor: direction}
				default:
					return {createdAt: direction}
			}
		}

		const sortOptions = body.sort.length ? body.sort : initialFlashcardsSortOrder
		const orderBy = sortOptions.map(option => getOrderBy(option.value, option.direction))

		const where: Prisma.FlashcardWhereInput = {
			learningProfileId: activeLearningProfileId,
		}

		if (body.searchTerm && body.searchTerm.trim() !== '') {
			const search = body.searchTerm.trim()
			where.OR = [
				{question: {contains: search, mode: 'insensitive'}},
				{answer: {text: {contains: search, mode: 'insensitive'}}},
			]
		}

		if (body.filter.hasNote !== undefined) {
			where.note = body.filter.hasNote ? {not: null} : null
		}

		if (body.filter.createdAtFrom || body.filter.createdAtTo) {
			where.createdAt = {}
			if (body.filter.createdAtFrom) {
				where.createdAt.gte = new Date(body.filter.createdAtFrom)
			}
			if (body.filter.createdAtTo) {
				where.createdAt.lte = new Date(body.filter.createdAtTo)
			}
		}

		if (body.filter.nextReviewDateFrom || body.filter.nextReviewDateTo) {
			where.nextReview = {}
			if (body.filter.nextReviewDateFrom) {
				where.nextReview.gte = new Date(body.filter.nextReviewDateFrom)
			}
			if (body.filter.nextReviewDateTo) {
				where.nextReview.lte = new Date(body.filter.nextReviewDateTo)
			}
		}

		if (body.filter.efactorFrom || body.filter.efactorTo) {
			where.eFactor = {}
			if (body.filter.efactorFrom) {
				where.eFactor.gte = body.filter.efactorFrom
			}
			if (body.filter.efactorTo) {
				where.eFactor.lte = body.filter.efactorTo
			}
		}

		const flashcards = await prisma.flashcard.findMany({
			take: limit,
			skip: cursor ? 1 : 0,
			where,
			orderBy: orderBy,
			include: {
				answer: true,
			},
			cursor: cursor ? {id: cursor} : undefined,
		})

		const lastFlashcard = flashcards[limit - 1]
		const newCursor = lastFlashcard?.id

		return NextResponse.json({flashcards, cursor: newCursor})
	} catch (error) {
		console.error('flashcards fetch error', error)
		return NextResponse.json({error: (error as Error).message || 'Unknown error'}, {status: 500})
	}
}
