'use client'
import {animate, Transition, useInView, useMotionValue, useMotionValueEvent} from 'motion/react'
import {useEffect, useRef} from 'react'

interface Props {
	maxValue: number
	initialValue?: number
	decimalPlaces?: number
	transition?: Transition
	whileInView?: false | true | 'once'
}

export default function AnimatedNumber({
	maxValue,
	initialValue = 0,
	decimalPlaces = 0,
	transition,
	whileInView = false,
}: Props) {
	const x = useMotionValue(initialValue)
	const ref = useRef<HTMLParagraphElement>(null)

	const inViewState = useInView(ref, {once: whileInView === 'once'})
	const isInView = whileInView ? inViewState : undefined

	useEffect(() => {
		if (isInView != undefined && !isInView) return
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
		/* eslint-disable-next-line react-hooks/exhaustive-deps */
	}, [isInView, initialValue, maxValue])

	useMotionValueEvent(x, 'change', latest => {
		if (ref.current) {
			ref.current.textContent = latest.toFixed(decimalPlaces)
		}
	})

	return <span ref={ref}>{initialValue}</span>
}
