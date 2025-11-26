import Footer from './_sections/Footer'

export default function MarketingLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<>
			{children}
			<Footer />
		</>
	)
}
