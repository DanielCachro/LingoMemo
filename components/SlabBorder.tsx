import {cn} from '@/lib/utils'

interface Props {
	children: React.ReactNode
	className?: string
	slabClassName?: string
	/** Controls the size of the border.
	 * - 'xs': 1px
	 * - 'sm': 2px
	 * - 'md': 3px
	 * - 'lg': 4px
	 */
	borderSize?: 'none' | 'xs' | 'sm' | 'md' | 'lg'
	/** Controls the size of the slab.
	 * - 'xs': 1px
	 * - 'sm': 2px
	 * - 'md': 3px
	 * - 'lg': 4px
	 */
	slabSize?: 'xs' | 'sm' | 'md' | 'lg'
	/** Controls the border radius of the component.
	 * - 'sm': 0.25rem
	 * - 'md': 0.5rem
	 * - 'lg': 0.75rem
	 * - 'xl': 1rem
	 * - 'full': calc(infinity*1px)
	 */
	rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

/**
 * Use this component when shadow-slab-* class causes rendering errors between the border and the slab.
 */
export default function SlabBorder({
	children,
	className,
	slabClassName,
	slabSize = 'sm',
	borderSize = 'sm',
	rounded = 'sm',
}: Props) {
	const sizes = {
		none: '0px',
		xs: '1px',
		sm: '2px',
		md: '3px',
		lg: '4px',
	}

	const borders = {
		sm: '0.25rem',
		md: '0.5rem',
		lg: '0.75rem',
		xl: '1rem',
		full: 'calc(infinity*1px)',
	}

	return (
		<div className='relative isolate'>
			<div
				className={cn(
					`border-background-300! bg-background-100 dark:border-background-700! dark:bg-background-900`,
					className,
				)}
				style={{border: `${sizes[borderSize]} solid `, borderRadius: borders[rounded]}}>
				{children}
			</div>
			<div
				className={cn(
					`absolute left-0 -z-50 h-full w-full bg-background-300 transition-colors duration-50 dark:bg-background-700 rounded-${rounded}`,
					slabClassName,
				)}
				style={{top: `${sizes[slabSize]}`, borderRadius: borders[rounded]}}></div>
		</div>
	)
}
