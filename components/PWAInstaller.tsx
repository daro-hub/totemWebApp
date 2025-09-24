'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallButton(true)
    }

    const handleAppInstalled = () => {
      console.log('PWA was installed')
      setShowInstallButton(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null)
    setShowInstallButton(false)
  }

  if (!showInstallButton) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <div className="font-semibold">Install AmuseApp</div>
            <div className="text-sm text-gray-300">Get the full screen experience</div>
          </div>
          <Button
            onClick={handleInstallClick}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Install
          </Button>
        </div>
      </div>
    </div>
  )
}
