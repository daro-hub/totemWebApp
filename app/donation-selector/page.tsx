'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import { PageLayout } from '@/components/PageLayout'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Heart } from 'lucide-react'

export default function DonationSelectorPage() {
  const router = useRouter()
  const { translations, setDonationAmount, donationAmount } = useApp()
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false)
  const [customAmount, setCustomAmount] = useState('')

  const predefinedAmounts = [2, 5, 10]

  const handleAmountSelect = (amount: number) => {
    setDonationAmount(amount)
    router.push('/payment-confirm')
  }

  const handleCustomAmount = () => {
    setIsCustomDialogOpen(true)
  }

  const handleCustomConfirm = () => {
    const amount = parseFloat(customAmount)
    if (amount > 0) {
      setDonationAmount(amount)
      setIsCustomDialogOpen(false)
      setCustomAmount('')
      router.push('/payment-confirm')
    }
  }

  const handleBack = () => {
    router.push('/quantity-selector')
  }

  return (
    <>
      <PageLayout
        title={translations.selectDonation}
        subtitle={translations.chooseDonation}
        navigation={
          <div className="flex gap-4 w-full">
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex-1 h-20 text-2xl font-bold border-white text-white hover:bg-white/10"
            >
              {translations.back}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center gap-8 w-full max-w-4xl">
          {/* Predefined amounts - in a single horizontal row */}
          <div className="grid grid-cols-3 gap-6 w-full">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className="w-full h-24 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center justify-center gap-4 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Heart className="w-8 h-8" />
                <span className="text-4xl font-bold">€{amount}</span>
              </button>
            ))}
          </div>

          {/* Custom amount button - full width below */}
          <button
            onClick={handleCustomAmount}
            className="w-full h-24 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center justify-center gap-4 transition-all duration-200 border-2 border-white/30 hover:border-white/50"
          >
            <Heart className="w-8 h-8" />
            <span className="text-4xl font-bold">{translations.customAmount}</span>
          </button>
        </div>
      </PageLayout>

      {/* Custom amount dialog */}
      <Dialog
        open={isCustomDialogOpen}
        onOpenChange={setIsCustomDialogOpen}
      >
        <div className="bg-black p-8 rounded-lg border border-white/20 max-w-md w-full mx-4">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            {translations.enterCustomAmount}
          </h2>
          
          <div className="mb-6">
            <Input
              type="number"
              placeholder={translations.customAmountPlaceholder}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full h-16 text-4xl text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              min="0.01"
              step="0.01"
            />
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setIsCustomDialogOpen(false)}
              variant="outline"
              className="flex-1 h-16 text-xl font-bold border-white text-white hover:bg-white/10"
            >
              {translations.cancel}
            </Button>
            <Button
              onClick={handleCustomConfirm}
              className="flex-1 h-16 text-xl font-bold bg-teal-600 hover:bg-teal-700 text-white"
              disabled={!customAmount || parseFloat(customAmount) <= 0}
            >
              {translations.confirm}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
