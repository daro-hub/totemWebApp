'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Logo } from '@/components/Logo'
import { QRCodeCarousel } from '@/components/QRCodeCarousel'
import { PageLayout } from '@/components/PageLayout'

export default function ThankYouPage() {
  const router = useRouter()
  const { translations, resetPurchase, setMuseumId } = useApp()
  const [email, setEmail] = useState('')
  const [timeLeft, setTimeLeft] = useState(20) // 20 seconds
  const [tickets, setTickets] = useState<any[]>([])
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0)
  const [isLastTicket, setIsLastTicket] = useState(false)
  const [hasSeenLastTicket, setHasSeenLastTicket] = useState(false)

  // Reset timer on screen touch - sempre se il timer è stato attivato
  const handleScreenTouch = () => {
    if (hasSeenLastTicket) {
      setTimeLeft(20)
    }
  }

  // Countdown timer - attivo dopo aver visto l'ultimo ticket, non si disattiva mai
  useEffect(() => {
    if (!hasSeenLastTicket) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Use setTimeout to avoid setState during render
          setTimeout(() => {
            resetPurchase()
            router.push('/')
          }, 0)
          return 20
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [hasSeenLastTicket, resetPurchase, router])

  // Check if current ticket is the last one and start timer
  useEffect(() => {
    const isLast = currentTicketIndex === tickets.length - 1
    setIsLastTicket(isLast)
    
    if (isLast && !hasSeenLastTicket) {
      setHasSeenLastTicket(true)
      setTimeLeft(20) // Il timer inizia automaticamente
    }
  }, [currentTicketIndex, tickets.length, hasSeenLastTicket])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleNewPurchase = () => {
    resetPurchase()
    router.push('/')
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the email with tickets
    console.log('Sending email to:', email)
    // Show success message or handle error
  }

  const handleTicketsGenerated = (generatedTickets: any[]) => {
    setTickets(generatedTickets)
  }

  const handleTicketIndexChange = (index: number) => {
    setCurrentTicketIndex(index)
  }

  return (
    <div 
      onTouchStart={handleScreenTouch}
      onClick={handleScreenTouch}
    >
      <PageLayout
        title={translations.thankYou}
        subtitle={translations.scanQR}
        navigation={
          <div className="w-full max-w-md space-y-4">
            {/* Timer - only show on last ticket */}
            {hasSeenLastTicket && (
              <div className="text-center">
                <div className="text-white text-xl mb-2">
                  {translations.autoReturn} {timeLeft}s
                </div>
              </div>
            )}

            {/* New Purchase Button */}
            <Button
              onClick={handleNewPurchase}
              className="w-full h-16 text-xl font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
            >
              {translations.newPurchase}
            </Button>
          </div>
        }
      >
        {/* QR Code Carousel */}
        <div className="mb-8">
          <QRCodeCarousel 
            onTicketsGenerated={handleTicketsGenerated}
            onTicketIndexChange={handleTicketIndexChange}
          />
        </div>

        {/* Email Input */}
        <div className="w-full max-w-md mb-6">
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-white text-lg font-medium mb-2">
                {translations.enterEmail}
              </label>
              <Input
                type="email"
                placeholder={translations.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 text-lg"
              />
            </div>
            <Button
              type="submit"
              variant="outline"
              className="w-full h-12 text-lg border-white text-white hover:bg-white/10"
            >
              {translations.sendEmail}
            </Button>
          </form>
        </div>
      </PageLayout>
    </div>
  )
}
