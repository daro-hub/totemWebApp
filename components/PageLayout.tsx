'use client'

import React from 'react'
import { Logo } from './Logo'

interface PageLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  navigation?: React.ReactNode
  className?: string
}

export function PageLayout({ 
  title, 
  subtitle, 
  children, 
  navigation,
  className = ''
}: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-black flex flex-col ${className}`}>
      {/* Header with Logo */}
      <div className="flex flex-col items-center pt-6 pb-4">
        <Logo />
      </div>

      {/* Title and Subtitle */}
      <div className="text-center mb-8 px-4">
        <h1 className="text-6xl font-bold text-white mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white text-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {children}
      </div>

      {/* Navigation */}
      {navigation && (
        <div className="px-4 pb-6 flex justify-center">
          {navigation}
        </div>
      )}
    </div>
  )
}
