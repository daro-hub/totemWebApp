'use client'

import React, { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, Ticket } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { generateMultipleTickets } from '@/lib/api'

interface Ticket {
  code: string
  qrUrl: string
}

interface QRCodeCarouselProps {
  onTicketsGenerated: (tickets: Ticket[]) => void
  onTicketIndexChange?: (index: number) => void
}

export function QRCodeCarousel({ onTicketsGenerated, onTicketIndexChange }: QRCodeCarouselProps) {
  const { ticketQuantity, museumId, museum, setTickets, isLoading, setLoading, setError } = useApp()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [tickets, setLocalTickets] = useState<Ticket[]>([])
  const [hasGenerated, setHasGenerated] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Generate tickets when component mounts - only once
  useEffect(() => {
    const generateTickets = async () => {
      if (ticketQuantity === 0 || hasGenerated) return

      setLoading(true)
      setError(null)
      setHasGenerated(true)

      try {
        console.log('=== TICKET GENERATION START ===')
        console.log('Museum Code:', museum?.code || 'TESTMUSEUM (fallback)')
        console.log('Ticket Quantity:', ticketQuantity)
        console.log('Museum ID:', museumId)
        
        // Usa il codice del museo se disponibile, altrimenti fallback
        const museumCode = museum?.code || 'TESTMUSEUM'
        
        const generatedTickets = await generateMultipleTickets(
          museumCode,
          ticketQuantity,
          museumId
        )
        
        console.log('Generated Tickets:', generatedTickets)
        console.log('=== TICKET GENERATION END ===')
        
        setLocalTickets(generatedTickets)
        setTickets(generatedTickets)
        onTicketsGenerated(generatedTickets)
      } catch (error) {
        console.error('Error generating tickets:', error)
        setError('Failed to generate tickets')
        // Fallback to mock tickets for development
        const mockTickets = Array.from({ length: ticketQuantity }, (_, i) => ({
          code: `MOCK_TICKET_${i + 1}_${Date.now()}`,
          qrUrl: `https://web.amuseapp.art/check-in?code=MOCK_TICKET_${i + 1}_${Date.now()}&museumId=${museumId}`
        }))
        
        console.log('=== MOCK TICKET GENERATION ===')
        console.log('Mock Tickets:', mockTickets)
        
        setLocalTickets(mockTickets)
        setTickets(mockTickets)
        onTicketsGenerated(mockTickets)
      } finally {
        setLoading(false)
      }
    }

    generateTickets()
  }, [ticketQuantity, museumId, museum?.code, hasGenerated])

  // Reset hasGenerated quando cambia ticketQuantity
  useEffect(() => {
    setHasGenerated(false)
  }, [ticketQuantity])

  const nextTicket = () => {
    if (isAnimating || tickets.length <= 1) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev + 1) % tickets.length)
    onTicketIndexChange?.((currentIndex + 1) % tickets.length)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const prevTicket = () => {
    if (isAnimating || tickets.length <= 1) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev - 1 + tickets.length) % tickets.length)
    onTicketIndexChange?.((currentIndex - 1 + tickets.length) % tickets.length)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const goToTicket = (index: number) => {
    if (isAnimating || index === currentIndex) return
    setIsAnimating(true)
    setCurrentIndex(index)
    onTicketIndexChange?.(index)
    setTimeout(() => setIsAnimating(false), 300)
  }

  if (isLoading) {
    return (
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        Generating tickets...
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center text-white">
        No tickets available
      </div>
    )
  }

  return (
    <div className="relative w-full h-80 flex items-center justify-center">
      {/* Container del carosello - centrato precisamente */}
      <div className="relative w-80 h-80 perspective-1000 flex items-center justify-center">
        {tickets.map((ticket, index) => {
          const isActive = index === currentIndex
          const isNext = index === (currentIndex + 1) % tickets.length
          const isPrev = index === (currentIndex - 1 + tickets.length) % tickets.length
          const isVisible = isActive || isNext || isPrev

          if (!isVisible) return null

          return (
            <QRCodeCard
              key={ticket.code}
              ticket={ticket}
              index={index}
              currentIndex={currentIndex}
              totalCards={tickets.length}
              isActive={isActive}
              isNext={isNext}
              isPrev={isPrev}
              onClick={() => goToTicket(index)}
            />
          )
        })}
      </div>

      {/* Controlli di navigazione - più verso i bordi */}
      <button
        onClick={prevTicket}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-teal-600/80 hover:bg-teal-600 rounded-full p-2 shadow-lg transition-all"
        disabled={isAnimating || tickets.length <= 1}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={nextTicket}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-teal-600/80 hover:bg-teal-600 rounded-full p-2 shadow-lg transition-all"
        disabled={isAnimating || tickets.length <= 1}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Indicatori - meno spazio sopra/sotto e più grandi */}
      {tickets.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {tickets.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTicket(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-teal-600' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Componente per la singola carta QR
interface QRCodeCardProps {
  ticket: Ticket
  index: number
  currentIndex: number
  totalCards: number
  isActive: boolean
  isNext: boolean
  isPrev: boolean
  onClick: () => void
}

function QRCodeCard({
  ticket,
  index,
  currentIndex,
  totalCards,
  isActive,
  isNext,
  isPrev,
  onClick,
}: QRCodeCardProps) {
  const { translations } = useApp()
  
  // Calcola la posizione e la rotazione - tutte dritte, solo profondità e spostamento
  const getCardTransform = () => {
    if (isActive) {
      return {
        transform: 'translateZ(0px) rotateY(0deg)',
        zIndex: 10,
        opacity: 1
      }
    }
    
    if (isNext) {
      return {
        transform: 'translateZ(-20px) rotateY(0deg) translateX(40px)',
        zIndex: 5,
        opacity: 0.8
      }
    }
    
    if (isPrev) {
      return {
        transform: 'translateZ(-20px) rotateY(0deg) translateX(-40px)',
        zIndex: 5,
        opacity: 0.8
      }
    }

    // Carte non visibili
    return {
      transform: 'translateZ(-40px) rotateY(0deg)',
      zIndex: 1,
      opacity: 0
    }
  }

  const cardStyle = getCardTransform()

  return (
    <div
      className={`absolute w-64 h-64 transition-all duration-300 ease-out cursor-pointer ${
        isActive ? 'scale-100' : 'scale-95'
      }`}
      style={{
        ...cardStyle,
        left: '50%',
        top: '50%',
        transform: `${cardStyle.transform} translate(-50%, -50%)`
      }}
      onClick={onClick}
    >
      {/* Carta principale - molto più semplice */}
      <div className="relative w-full h-full bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header della carta */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-teal-600 flex items-center justify-center z-10">
          <span className="font-bold text-white text-sm">
            {translations.ticket} #{index + 1}
          </span>
        </div>

        {/* QR Code - quadrato semplice */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-white p-2">
          <QRCode
            value={ticket.qrUrl}
            size={176}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          />
        </div>

        {/* Effetto di profondità con ombra */}
        <div className="absolute inset-0 rounded-lg shadow-xl pointer-events-none" />
      </div>
    </div>
  )
}