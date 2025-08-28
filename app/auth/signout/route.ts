import {createClient} from '@/lib/supabase/server'
import {NextRequest, NextResponse} from 'next/server'
import getOrigin from '../getOrigin'

export async function GET(request: NextRequest) {
	const supabase = await createClient()
	const origin = getOrigin(request)

	const {error} = await supabase.auth.signOut()

	if (error) {
		return NextResponse.redirect(`${origin}/auth/error`)
	}

	return NextResponse.redirect(`${origin}`)
}
