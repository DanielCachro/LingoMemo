import {updateFlashcard} from '@/lib/actions/study'
import {FlashcardResponseQuality} from '@/types/study'
import {NextRequest, NextResponse} from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const {flashcardId, q} = body as {flashcardId: number; q: FlashcardResponseQuality}
		const result = await updateFlashcard(flashcardId, q)
		return NextResponse.json(result)
	} catch (error: unknown) {
		console.error('API update error', error)
		return NextResponse.json({error: (error as Error).message || 'Unknown error'}, {status: 500})
	}
}
