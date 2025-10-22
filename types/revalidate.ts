interface RevalidationEnabledConfig {
	revalidateAfter: true
	pathToRevalidate: string
	type: 'layout' | 'page'
}

interface RevalidationDisabledConfig {
	revalidateAfter?: false
	pathToRevalidate?: never
    type?: never
}

export type RevalidationConfig = RevalidationEnabledConfig | RevalidationDisabledConfig
