import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sky Pay - Secure Access',
  description: 'Tactical Operations Dashboard - Secure Login',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 