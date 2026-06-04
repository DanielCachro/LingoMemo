import {getNextFlashcards} from '@/lib/actions/study'
import {NextRequest, NextResponse} from 'next/server'

export async function GET(request: NextRequest) {
	const limit = Number(request.nextUrl.searchParams.get('limit') ?? 5)
	const excludeParam = request.nextUrl.searchParams.get('excludeIds') ?? ''
	try {
		const excludeIds = excludeParam
			.split(',')
			.map(id => Number(id))
			.filter(id => Number.isFinite(id) && id > 0)

		const flashcards = await getNextFlashcards(limit, excludeIds)
		return NextResponse.json(flashcards, {status: 200})
	} catch (error) {
		console.error('prefetch error', error)
		return NextResponse.json({error: (error as Error).message || 'Unknown error'}, {status: 500})
	}
}
