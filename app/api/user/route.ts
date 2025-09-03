import {getCurrentUser} from '@/lib/userActions'
import {NextRequest, NextResponse} from 'next/server'

export async function GET(request: NextRequest) {
	try {
		const user = await getCurrentUser()
		return NextResponse.json({user})
	} catch (error) {
		console.error(error)
		return NextResponse.json({error: 'Nie udało się pobrać użytkownika'}, {status: 500})
	}
}
