import type {FlashcardsFilter} from '@/app/@modal/flashcards/(.)filter/page'
import type {FlashcardsSort} from '@/app/@modal/flashcards/(.)sort/page'
import {getCurrentUser} from '@/lib/actions/user'
import {prisma} from '@/prisma/client'
import {Prisma} from '@prisma/client'
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

		const body = (await request.json()) as {sort: FlashcardsSort | []; filter: FlashcardsFilter | Record<string, never>}
		if (!body.sort) {
			return NextResponse.json({error: 'Sort parameter is required'}, {status: 400})
		}
		if (!body.filter) {
			return NextResponse.json({error: 'Filter parameter is required'}, {status: 400})
		}

		console.log(body.filter, body.sort)

		const where: Prisma.FlashcardWhereInput = {
			learningProfileId: activeLearningProfileId,
		}
		// TODO: Dynamically build 'where' based on 'body.filter'
		// TODO: Dynamically build 'orderBy' based on 'body.sort'

		const flashcards = await prisma.flashcard.findMany({
			take: limit,
			skip: cursor ? 1 : 0,
			where: {
				learningProfileId: activeLearningProfileId,
			},
			include: {
				answer: true,
			},
			cursor: cursor ? {id: cursor} : undefined,
		})

		console.log(flashcards)

		const lastFlashcard = flashcards[limit - 1]
		const newCursor = lastFlashcard?.id

		return NextResponse.json({flashcards, cursor: newCursor})
	} catch (error) {
		console.error('flashcards fetch error', error)
		return NextResponse.json({error: (error as Error).message || 'Unknown error'}, {status: 500})
	}
}
