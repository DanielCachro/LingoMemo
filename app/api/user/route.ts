import {getCurrentUser} from '@/lib/actions/user'
import {NextResponse} from 'next/server'

export async function GET() {
	try {
		const user = await getCurrentUser()
		return NextResponse.json({user}, {status: 200})
	} catch (error) {
		console.error(error)
		return NextResponse.json({error: 'Nie udało się pobrać użytkownika'}, {status: 500})
	}
}
