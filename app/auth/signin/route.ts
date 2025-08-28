import {createClient} from '@/lib/supabase/server'
import {NextRequest, NextResponse} from 'next/server'
import getOrigin from '../getOrigin'

export async function GET(request: NextRequest) {
	const supabase = await createClient()
	const origin = getOrigin(request)

	const {data, error} = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo: `${origin}/auth/callback`,
		},
	})

	if (error) {
		return NextResponse.redirect(`${origin}/auth/error`)
	}

	if (data.url) {
		return NextResponse.redirect(data.url)
	}

	return NextResponse.redirect(`${origin}/auth/error`)
}
