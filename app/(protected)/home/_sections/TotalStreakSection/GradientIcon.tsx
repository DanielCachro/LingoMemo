import {useId} from 'react'

export default function GradientIcon({size = 24}: {size?: number}) {
	const id = useId().replace(/:/g, '')
	const filterId = `filter-${id}`
	const gradientId = `gradient-${id}`

	return (
		<svg
			aria-hidden='true'
			style={{width: `${size / 16}rem`, height: `${size / 16}rem`}}
			viewBox='0 0 51 56'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'>
			<g filter={`url(#${filterId})`}>
				<path
					d='M19.4344 4.50764C20.1656 3.82327 21.3 3.83264 22.0312 4.51702C24.6187 6.94514 27.0469 9.56077 29.3156 12.392C30.3469 11.042 31.5188 9.57014 32.7844 8.37014C33.525 7.67639 34.6688 7.67639 35.4094 8.37952C38.6531 11.4733 41.4 15.5608 43.3313 19.442C45.2344 23.267 46.5 27.1764 46.5 29.9326C46.5 41.8951 37.1437 52.0014 25.5 52.0014C13.725 52.0014 4.5 41.8858 4.5 29.9233C4.5 26.3233 6.16875 21.9264 8.75625 17.5764C11.3719 13.1608 15.0656 8.55764 19.4344 4.50764ZM25.6594 43.0014C28.0312 43.0014 30.1313 42.3451 32.1094 41.0326C36.0562 38.2764 37.1156 32.7639 34.7438 28.4326C34.3219 27.5889 33.2438 27.5326 32.6344 28.2451L30.2719 30.992C29.6531 31.7045 28.5375 31.6858 27.9562 30.9451C26.4094 28.9764 23.6437 25.4608 22.0687 23.4639C21.4781 22.7139 20.3531 22.7045 19.7531 23.4545C16.5844 27.4389 14.9906 29.9514 14.9906 32.7733C15 39.1951 19.7437 43.0014 25.6594 43.0014Z'
					fill={`url(#${gradientId})`}
				/>
			</g>
			<defs>
				<filter
					id={filterId}
					x='0.5'
					y='-0.000976562'
					width='50'
					height='57.0024'
					filterUnits='userSpaceOnUse'
					colorInterpolationFilters='sRGB'>
					<feColorMatrix
						in='SourceAlpha'
						type='matrix'
						values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
						result='hardAlpha'
					/>
					<feOffset dy='1' />
					<feGaussianBlur stdDeviation='1.5' />
					<feComposite in2='hardAlpha' operator='arithmetic' k2='-1' k3='1' />
					<feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0' />
					<feBlend mode='normal' in2='SourceGraphic' result='effect1_innerShadow_716_7167' />
					<feColorMatrix
						in='SourceAlpha'
						type='matrix'
						values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
						result='hardAlpha'
					/>
					<feOffset dy='1' />
					<feGaussianBlur stdDeviation='1' />
					<feComposite in2='hardAlpha' operator='arithmetic' k2='-1' k3='1' />
					<feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0' />
					<feBlend mode='normal' in2='effect1_innerShadow_716_7167' result='effect2_innerShadow_716_7167' />
				</filter>
				<linearGradient id={gradientId} x1='25.5' y1='3.99902' x2='25.5' y2='52.0014' gradientUnits='userSpaceOnUse'>
					<stop stopColor='#EF887A' />
					<stop offset='1' stopColor='#D04532' />
				</linearGradient>
			</defs>
		</svg>
	)
}
