'use client'

import React, { useState, useEffect } from 'react'

export function Logo() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    // Server-side rendering - render placeholder
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <div className="w-full h-full bg-gray-800 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  // Client-side rendering - render actual logo
  return (
    <div className="flex flex-col items-center">
      {/* Logo Image */}
      <div className="relative w-24 h-24">
        <img
          src="/logo_amuseapp.png"
          alt="AmuseApp Logo"
          width={96}
          height={96}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  )
}
