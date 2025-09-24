'use client'

import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/Logo'
import { Ticket } from 'lucide-react'

export default function PaymentConfirmPage() {
  const router = useRouter()
  const { ticketQuantity, ticketPrice, translations } = useApp()

  const totalPrice = ticketQuantity * ticketPrice

  const handlePayNow = () => {
    // Simulate payment processing
    router.push('/thank-you')
  }

  const handleBack = () => {
    router.push('/quantity-selector')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header with Logo */}
      <div className="flex flex-col items-center pt-8 pb-4">
        <Logo />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {translations.paymentConfirmation}
          </h1>
          <p className="text-white text-lg">
            {translations.reviewOrder}
          </p>
        </div>

        {/* Order Details */}
        <div className="flex items-center justify-center gap-6 mb-12">
          {/* Order Icon */}
          <div className="w-16 h-16 flex items-center justify-center">
            <Ticket className="w-12 h-12 text-white" />
          </div>

          {/* Order Info */}
          <div className="text-left">
            <div className="text-2xl font-bold text-white mb-1">
              {translations.quantity}: {ticketQuantity}
            </div>
            <div className="text-xl font-bold text-white">
              {translations.total}: €{totalPrice}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-md space-y-4">
          <Button
            onClick={handlePayNow}
            className="w-full h-14 text-lg font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
          >
            {translations.payNow}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleBack}
            className="w-full h-14 text-lg font-semibold border-2 border-white bg-black hover:bg-white/10 text-white rounded-lg"
          >
            {translations.back}
          </Button>
        </div>
      </div>
    </div>
  )
}
