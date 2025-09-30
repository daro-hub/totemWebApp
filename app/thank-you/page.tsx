'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Logo } from '@/components/Logo'
import { QRCodeCarousel } from '@/components/QRCodeCarousel'
import { PageLayout } from '@/components/PageLayout'
import { CheckCircle } from 'lucide-react'

export default function ThankYouPage() {
  const router = useRouter()
  const { translations, resetPurchase, setMuseumId, museum, ticketQuantity, ticketPrice, donationAmount } = useApp()
  
  // Email translations with fallbacks
  const emailTranslations = {
    emailSubject: (translations as any).emailSubject || 'Your tickets for',
    emailGreeting: (translations as any).emailGreeting || 'Hello! Here are your tickets',
    emailMessage: (translations as any).emailMessage || 'Thank you for choosing AmuseApp! Enjoy your visit with our interactive audio guide.',
    museumName: (translations as any).museumName || 'Museum',
    yourTickets: (translations as any).yourTickets || 'Your tickets',
    ticketCode: (translations as any).ticketCode || 'Code',
    qrCode: (translations as any).qrCode || 'QR Code',
    attachedFile: (translations as any).attachedFile || 'Attached',
    howToUse: (translations as any).howToUse || 'How to use your tickets',
    step1: (translations as any).step1 || 'Scan the QR code of each ticket at the entrance',
    step2: (translations as any).step2 || 'Open the audio guide on your smartphone',
    step3: (translations as any).step3 || 'Enjoy your visit!',
    emailFooter: (translations as any).emailFooter || 'Thank you for choosing AmuseApp for your visit!',
    contactInfo: (translations as any).contactInfo || 'For support: support@amuseapp.it',
    emailSuccess: (translations as any).emailSuccess || 'Email sent successfully!',
    emailError: (translations as any).emailError || 'Failed to send email. Please try again.',
    sendingEmail: (translations as any).sendingEmail || 'Sending email...'
  }
  const [email, setEmail] = useState('')
  const [timeLeft, setTimeLeft] = useState(20) // 20 seconds
  const [tickets, setTickets] = useState<any[]>([])
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0)
  const [isLastTicket, setIsLastTicket] = useState(false)
  const [hasSeenLastTicket, setHasSeenLastTicket] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Reset timer on screen touch - sempre se il timer è stato attivato
  const handleScreenTouch = () => {
    if (hasSeenLastTicket) {
      setTimeLeft(20)
    }
  }

  // Reset timer on email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
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

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/
    return emailRegex.test(email)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidEmail(email) || isSendingEmail) return

    setIsSendingEmail(true)
    setEmailStatus('idle')

    try {
      const totalPrice = ticketQuantity * ticketPrice
      const finalTotal = museum?.is_church ? donationAmount : totalPrice

      const orderSummary = {
        quantity: ticketQuantity,
        price: ticketPrice,
        total: finalTotal,
        isDonation: museum?.is_church || false,
        donationAmount: donationAmount
      }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          tickets,
          translations: emailTranslations,
          museum,
          orderSummary
        })
      })

      if (response.ok) {
        setEmailStatus('success')
        setEmail('') // Clear email after successful send
      } else {
        setEmailStatus('error')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      setEmailStatus('error')
    } finally {
      setIsSendingEmail(false)
    }
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
            {/* Return Home Button with Progress Bar */}
            <div className="relative">
              <Button
                onClick={handleNewPurchase}
                className="w-full h-20 text-2xl font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg relative overflow-hidden"
              >
                {translations.returnHome}
                
                {/* Progress Bar - only show on last ticket */}
                {hasSeenLastTicket && (
                  <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full">
                    <div 
                      className="h-full bg-white transition-all duration-1000 ease-linear"
                      style={{ width: `${((20 - timeLeft) / 20) * 100}%` }}
                    />
                  </div>
                )}
              </Button>
            </div>
          </div>
        }
      >
        {/* QR Code Carousel */}
        <div className="mb-4">
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
                placeholder="youremail@example.com"
                value={email}
                onChange={handleEmailChange}
                className="w-full h-12 text-lg"
              />
            </div>
            {isValidEmail(email) && (
              <Button
                type="submit"
                variant="outline"
                className="w-full h-12 text-lg border-white text-white hover:bg-white/10"
                disabled={isSendingEmail}
              >
                {isSendingEmail ? emailTranslations.sendingEmail : translations.sendEmail}
              </Button>
            )}
            
            {/* Email Status Messages */}
            {emailStatus === 'success' && (
              <div className="flex items-center justify-center gap-2 text-center text-teal-400 text-sm mt-2">
                <CheckCircle className="w-4 h-4" />
                {emailTranslations.emailSuccess}
              </div>
            )}
            {emailStatus === 'error' && (
              <div className="text-center text-red-400 text-sm mt-2">
                {emailTranslations.emailError}
              </div>
            )}
          </form>
        </div>
      </PageLayout>
    </div>
  )
}
