import type {LearningProfileTypes} from '@/types/profile'
import {faBook, faGraduationCap, faHome, faWindowRestore} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

interface NavigationItem {
	title: string
	href: string
	icon: React.ReactNode
	displayForProfile: LearningProfileTypes[]
}

export const navigationItems: NavigationItem[] = [
	{
		title: 'Home',
		href: '/home',
		icon: <FontAwesomeIcon icon={faHome} />,
		displayForProfile: ['language', 'self-study'],
	},
	{
		title: 'Study',
		href: '/study',
		icon: <FontAwesomeIcon icon={faGraduationCap} />,
		displayForProfile: ['language', 'self-study'],
	},
	{
		title: 'Flashcards',
		href: '/flashcards',
		icon: <FontAwesomeIcon icon={faWindowRestore} />,
		displayForProfile: ['language', 'self-study'],
	},
	{
		title: 'Dictionary',
		href: '/dictionary',
		icon: <FontAwesomeIcon icon={faBook} />,
		displayForProfile: ['language'],
	},
]
