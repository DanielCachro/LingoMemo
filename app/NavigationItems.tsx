import {ReactNode} from 'react'
import {navigationItems} from '@/lib/navigationItems'

interface Props {
	children: (links: typeof navigationItems) => ReactNode
}

export default function NavigationItems({children}: Props) {
	return <>{children && children(navigationItems)}</>
}
