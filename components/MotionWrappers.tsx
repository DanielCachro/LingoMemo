'use client'
import type {HTMLMotionProps} from 'motion/react'
import {motion} from 'motion/react'

export function MotionP(props: HTMLMotionProps<'p'>) {
	return <motion.p {...props}>{props.children}</motion.p>
}
