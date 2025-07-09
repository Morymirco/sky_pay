import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { QueryProvider } from '@/lib/providers/query-provider'
import { AuthCheckProvider } from '@/lib/providers/auth-check-provider'

export const metadata: Metadata = {
  title: 'Sky Pay - Transfert d\'argent',
  description: 'Solution de transfert d\'argent sécurisée',
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AuthCheckProvider>
              {children}
            </AuthCheckProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
