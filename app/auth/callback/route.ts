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
			const {
				data: {user},
				error: userError,
			} = await supabase.auth.getUser()

			async function signOutAndRedirect() {
				await supabase.auth.signOut()
				return NextResponse.redirect(`${origin}/auth/error`)
			}

			if (userError || !user) {
				console.error('Auth callback error: User not found or error fetching user', userError)
				return await signOutAndRedirect()
			}

			try {
				await createNewUser(user)
			} catch (e) {
				console.error('Auth callback error: Failed to create new user', e)
				return await signOutAndRedirect()
			}

			return NextResponse.redirect(`${origin}${next}/home`)
		} else {
			console.error('Auth callback error: Exchange code for session failed', error)
		}
	}

	return NextResponse.redirect(`${origin}/auth/error`)
}
