'use client'

import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/Logo'
import { Minus, Plus } from 'lucide-react'

export default function QuantitySelectorPage() {
  const router = useRouter()
  const { ticketQuantity, setTicketQuantity, translations } = useApp()

  const handleDecrement = () => {
    if (ticketQuantity > 1) {
      setTicketQuantity(ticketQuantity - 1)
    }
  }

  const handleIncrement = () => {
    if (ticketQuantity < 10) { // Max 10 tickets
      setTicketQuantity(ticketQuantity + 1)
    }
  }

  const handleProceed = () => {
    router.push('/payment-confirm')
  }

  const handleBack = () => {
    router.push('/')
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
            {translations.selectQuantity}
          </h1>
          <p className="text-white text-lg">
            {translations.howManyTickets}
          </p>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-center gap-6 mb-12">
          {/* Decrement Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleDecrement}
            disabled={ticketQuantity <= 1}
            className="w-16 h-16 rounded-lg border-2 border-white bg-black hover:bg-white/10"
          >
            <Minus className="w-8 h-8 text-white" />
          </Button>

          {/* Quantity Display */}
          <div className="text-6xl font-bold text-white min-w-[120px] text-center">
            {ticketQuantity}
          </div>

          {/* Increment Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleIncrement}
            disabled={ticketQuantity >= 10}
            className="w-16 h-16 rounded-lg border-2 border-white bg-black hover:bg-white/10"
          >
            <Plus className="w-8 h-8 text-white" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-md space-y-4">
          <Button
            onClick={handleProceed}
            className="w-full h-14 text-lg font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
          >
            {translations.proceed}
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
