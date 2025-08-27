import {createClient} from '@/lib/supabase/server'
import {NextRequest, NextResponse} from 'next/server'

export async function GET(request: NextRequest) {
	const supabase = await createClient()
	const {origin} = new URL(request.url)

	const {error} = await supabase.auth.signOut()

	if (error) {
		return NextResponse.redirect(`${origin}/auth/error`)
	}

	return NextResponse.redirect(`${origin}`)
}
