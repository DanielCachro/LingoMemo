import {setUserTimeZone} from '@/lib/actions/user'
import {NextRequest, NextResponse} from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const {timeZone, offsetMinutes} = body as {timeZone: string; offsetMinutes: number}
		const result = await setUserTimeZone(timeZone, offsetMinutes)
		return NextResponse.json(result, {status: 200})
	} catch (error: unknown) {
		console.error('API update error', error)
		return NextResponse.json({error: (error as Error).message || 'Unknown error'}, {status: 500})
	}
}
