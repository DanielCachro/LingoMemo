import {getCurrentUser} from '@/lib/queries/user'
import {NextResponse} from 'next/server'

export async function GET() {
	const user = await getCurrentUser()

	if (!user) {
		return NextResponse.json({error: 'User not authenticated.'}, {status: 401})
	}

	return NextResponse.json({user}, {status: 200})
}
