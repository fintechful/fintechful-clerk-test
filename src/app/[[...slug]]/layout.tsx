// src/app/[[...slug]]/layout.tsx
import type { ReactNode } from 'react'
import '../../app/[[...slug]]/agent-css.css' // Your v0 agent CSS
import { Inter, Poppins } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter' 
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

export default function AgentSubdomainLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head />
      <body className="font-sans antialiased bg-white min-h-screen">
        {children}
      </body>
    </html>
  )
}