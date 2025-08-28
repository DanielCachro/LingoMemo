import {NextRequest, NextResponse} from 'next/server'
// The client you created from the Server-Side Auth instructions
import {createClient} from '@/lib/supabase/server'
import getOrigin from '../getOrigin'
import {createNewUser} from './createNewUser'

export async function GET(request: NextRequest) {
	const {searchParams} = new URL(request.url)
	const origin = getOrigin(request)
	const code = searchParams.get('code')
	// if "next" is in param, use it as the redirect URL
	let next = searchParams.get('next') ?? '/'
	if (!next.startsWith('/')) {
		// if "next" is not a relative URL, use the default
		next = '/'
	}

	if (code) {
		const supabase = await createClient()
		const {error} = await supabase.auth.exchangeCodeForSession(code)

		if (!error) {
			const user = await supabase.auth.getUser()

			async function signOutAndRedirect() {
				await supabase.auth.signOut()
				return NextResponse.redirect(`${origin}/auth/error`)
			}

			if (!user) {
				return await signOutAndRedirect()
			}

			try {
				await createNewUser(user.data.user)
			} catch {
				return await signOutAndRedirect()
			}

			return NextResponse.redirect(`${origin}${next}/home`)
		}
	}

	return NextResponse.redirect(`${origin}/auth/error`)
}
