import {faBook, faGraduationCap, faHome, faWindowRestore} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

export const navigationItems = [
	{
		title: 'Home',
		href: '/home',
		icon: <FontAwesomeIcon icon={faHome} />,
	},
	{
		title: 'Study',
		href: '/study',
		icon: <FontAwesomeIcon icon={faGraduationCap} />,
	},
	{
		title: 'Flashcards',
		href: '/flashcards',
		icon: <FontAwesomeIcon icon={faWindowRestore} />,
	},
	{
		title: 'Dictionary',
		href: '/dictionary',
		icon: <FontAwesomeIcon icon={faBook} />,
	},
]
