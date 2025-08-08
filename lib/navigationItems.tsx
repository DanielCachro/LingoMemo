import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHome, faGraduationCap, faBook} from '@fortawesome/free-solid-svg-icons'

export const navigationItems = [
	{
		title: 'Home',
		href: '/',
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
