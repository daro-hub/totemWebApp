'use client'

import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/Logo'
import { Ticket } from 'lucide-react'
import { sendPaymentToAndroid, createPaymentData, isRunningInAndroidWrapper } from '@/lib/android-bridge'
import { PageLayout } from '@/components/PageLayout'

export default function PaymentConfirmPage() {
  const router = useRouter()
  const { ticketQuantity, ticketPrice, translations, museumId } = useApp()

  const totalPrice = ticketQuantity * ticketPrice

  const handlePayNow = () => {
    // Invia dati pagamento all'app Android se in esecuzione in wrapper
    if (isRunningInAndroidWrapper()) {
      const paymentData = createPaymentData(totalPrice, ticketQuantity, museumId)
      sendPaymentToAndroid(paymentData)
      console.log('Dati pagamento inviati all\'app Android:', paymentData)
    }
    
    // Continua con il flusso normale
    router.push('/thank-you')
  }

  const handleBack = () => {
    router.push('/quantity-selector')
  }

  return (
    <PageLayout
      title={translations.paymentConfirmation}
      subtitle={translations.reviewOrder}
      navigation={
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
      }
    >
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
    </PageLayout>
  )
}
