'use client'
import {animate, Transition, useInView, useMotionValue, useMotionValueEvent} from 'motion/react'
import {useEffect, useRef} from 'react'

interface Props {
	maxValue: number
	initialValue?: number
	decimalPlaces?: number
	transition?: Transition
	whileInView?: boolean
	once?: boolean
}

export default function AnimatedNumber({
	maxValue,
	initialValue = 0,
	decimalPlaces = 0,
	transition,
	whileInView = false,
	once = false,
}: Props) {
	const x = useMotionValue(initialValue)
	const ref = useRef<HTMLParagraphElement>(null)
	const isInView = useInView(ref, {once})

	useEffect(() => {
		if (whileInView && !isInView) return
		if (initialValue === maxValue) return

		const controls = animate(initialValue, maxValue, {
			duration: 2.5,
			ease: 'circOut',
			...transition,
			onUpdate(latest) {
				x.set(+latest.toFixed(decimalPlaces))
			},
		})

		return () => controls.stop()
	}, [isInView, whileInView, initialValue, maxValue, decimalPlaces, x, transition])

	useMotionValueEvent(x, 'change', latest => {
		if (ref.current) {
			ref.current.textContent = latest.toFixed(decimalPlaces)
		}
	})

	return <span ref={ref}>{initialValue}</span>
}
