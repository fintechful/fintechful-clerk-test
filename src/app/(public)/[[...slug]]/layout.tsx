// src/app/[[...slug]]/layout.tsx

import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '@/styles/agent-css.css' // v0 agent CSS
import { Inter, Poppins } from 'next/font/google'

export const metadata: Metadata = {
  title: 'FinTechful Agent | Free Leads, Growth Tools & Funding',
  description: 'Connect with a local FinTechful agent for free qualified leads, digital growth solutions, and business funding.',
  openGraph: {
    title: 'FinTechful Agent',
    description: 'Free leads and growth tools for your business',
    images: ['/og-agent-default.jpg'],
    url: 'https://fintechful.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinTechful Agent',
    description: 'Free leads and growth tools for your business',
    images: ['/og-agent-default.jpg'],
  },
}

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