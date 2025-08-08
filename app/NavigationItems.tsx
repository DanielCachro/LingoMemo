import {ReactNode} from 'react'
import {navigationItems} from '@/lib/navigationItems'
import NavigationItem from './NavigationItem'

interface NavigationItemsProps {
	className?: string
	children: (item: (typeof navigationItems)[number]) => ReactNode
}

export default function NavigationItems({children, className}: NavigationItemsProps) {
	return <ul className={className}>{navigationItems.map(item => children(item))}</ul>
}

// NavigationItem as imported component because it uses the "use client" directive, and Next.js does not support passing functions to props from a server-side component to a client-side component, so I cannot change the NavigationItems component completely to "use client" and move NavigationItem here.
NavigationItems.NavigationItem = NavigationItem

// I deliberately do not block the use of NavigationItem / NavigationItems.NavigationItem outside of NavigationItems.
