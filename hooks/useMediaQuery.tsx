import {useLayoutEffect, useState} from 'react'

export function useMediaQuery(query: string) {
	const [matches, setMatches] = useState(window.matchMedia(query).matches)

	useLayoutEffect(() => {
		const media = window.matchMedia(query)

		const handleChange = () => setMatches(media.matches)
		handleChange()

		media.addEventListener('change', handleChange)
		return () => media.removeEventListener('change', handleChange)
	}, [query])

	return matches
}
