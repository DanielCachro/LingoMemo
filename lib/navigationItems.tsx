import {faBook, faGraduationCap, faHome} from '@fortawesome/free-solid-svg-icons'
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
		title: 'Dictionary',
		href: '/dictionary',
		icon: <FontAwesomeIcon icon={faBook} />,
	},
]
