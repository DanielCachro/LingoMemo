'use client'
import PrimaryButton from '@/components/PrimaryButton'
import {cn} from '@/lib/utils'
import Image from 'next/image'
import {useRouter} from 'next/navigation'

const statusMap = {
	done: {
		image: 'CatHappy',
		emotion: 'happy',
		width: 120,
		height: 112,
		message: 'Boom! You’ve done your part for today, now go high-five yourself or pet a cat or something.',
	},
	empty: {
		image: 'CatWow',
		emotion: 'amazed',
		width: 120,
		height: 112,
		message: 'Nothing here! At least for now.',
	},
	error: {
		image: 'CatCry',
		emotion: 'crying',
		width: 120,
		height: 113,
		message: 'Oops! Something went wrong. Please try again later.',
	},
}

export default function Status({
	children,
	status,
	buttonText,
	variant = 'horizontal',
	className,
	wrapperClassName,
	buttonClassName,
	showButton = true,
	onButtonClick,
}: {
	children?: React.ReactNode
	variant?: 'horizontal' | 'vertical'
	status: keyof typeof statusMap
	className?: string
	wrapperClassName?: string
	buttonText?: string
	buttonClassName?: string
	showButton?: boolean
	onButtonClick?: () => void
}) {
	const router = useRouter()
	return (
		<div
			className={cn('flex flex-col-reverse items-center gap-24', {
				'[@media(min-width:450px)]:flex-row [@media(min-width:450px)]:justify-around [@media(min-width:450px)]:gap-0':
					variant === 'horizontal',
				wrapperClassName,
			})}>
			<div
				className={cn(
					'flex max-w-256 flex-col gap-24 text-center',
					{
						'[@media(min-width:450px)]:items-start [@media(min-width:450px)]:text-left': variant === 'horizontal',
					},
					className,
				)}>
				{children || <p>{statusMap[status].message}</p>}
				{showButton && (
					<PrimaryButton
						className={buttonClassName}
						onClick={() => {
							if (onButtonClick) {
								onButtonClick()
							} else {
								router.push('/home')
							}
						}}>
						{buttonText || 'Head To Dashboard'}
					</PrimaryButton>
				)}
			</div>
			<Image
				src={`/cats/${statusMap[status].image}.svg`}
				alt={`Brand cat ${statusMap[status].emotion}`}
				width={statusMap[status].width}
				height={statusMap[status].height}
				priority
				className='w-128'
			/>
		</div>
	)
}
