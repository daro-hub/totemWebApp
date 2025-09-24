'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useApp } from '@/contexts/AppContext'

interface MuseumIdDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MuseumIdDialog({ open, onOpenChange }: MuseumIdDialogProps) {
  const { museumId, setMuseumId, setMuseum, ticketPrice, setTicketPrice, translations } = useApp()
  const [newMuseumId, setNewMuseumId] = useState(museumId)
  const [newTicketPrice, setNewTicketPrice] = useState(ticketPrice.toString())

  const handleConfirm = () => {
    if (newMuseumId && newMuseumId !== museumId) {
      setMuseumId(newMuseumId)
      setMuseum(null) // Reset museum data when changing museum ID
    }
    const price = parseFloat(newTicketPrice)
    if (!isNaN(price) && price > 0 && price !== ticketPrice) {
      setTicketPrice(price)
    }
    onOpenChange(false)
  }

  const handleCancel = () => {
    setNewMuseumId(museumId) // Reset to current value
    setNewTicketPrice(ticketPrice.toString()) // Reset price to current value
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{translations.museumIdDialog.title}</DialogTitle>
          <DialogDescription>
            {translations.museumIdDialog.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              {translations.museumIdDialog.placeholder}
            </label>
            <Input
              type="text"
              placeholder={translations.museumIdDialog.placeholder}
              value={newMuseumId}
              onChange={(e) => setNewMuseumId(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Ticket Price (€)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="5.00"
              value={newTicketPrice}
              onChange={(e) => setNewTicketPrice(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {translations.museumIdDialog.cancel}
          </Button>
          <Button onClick={handleConfirm}>
            {translations.museumIdDialog.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
