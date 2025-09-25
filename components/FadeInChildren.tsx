'use client'
import {motion} from 'framer-motion'
import React, {ReactNode} from 'react'

type FadeInChildrenProps = {
	children: ReactNode
	delay?: number
	delayStep?: number
	duration?: number
	className?: string
}

const fadeVariants = {
	hidden: {opacity: 0},
	visible: {opacity: 1},
}

export default function FadeInChildren({
	children,
	delay = 0,
	delayStep = 0.1,
	duration = 0.3,
	className,
}: FadeInChildrenProps) {
	return (
		<>
			{React.Children.map(children, (child, idx) => (
				<motion.div
					variants={fadeVariants}
					initial='hidden'
					animate='visible'
					transition={{
						duration,
						delay: delay + idx * delayStep,
					}}
					style={{width: '100%'}}
					className={className}>
					{child}
				</motion.div>
			))}
		</>
	)
}
