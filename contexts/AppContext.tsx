'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { getTranslation, Translations } from '@/lib/translations'

interface MuseumLanguage {
  language_id: number
  code: string
  name: string
}

interface Museum {
  name: string
  code: string
  museum_languages: MuseumLanguage[]
  is_church: boolean
}

interface Ticket {
  code: string
  qrUrl: string
}

interface AppState {
  // Museum data
  museum: Museum | null
  museumId: string
  selectedLanguage: string
  ticketPrice: number
  
  // Purchase flow
  ticketQuantity: number
  tickets: Ticket[]
  donationAmount: number
  
  // UI state
  translations: Translations
  isLoading: boolean
  error: string | null
}

interface AppContextType extends AppState {
  // Actions
  setMuseum: (museum: Museum | null) => void
  setMuseumId: (id: string) => void
  setSelectedLanguage: (language: string) => void
  setTicketPrice: (price: number) => void
  setTicketQuantity: (quantity: number) => void
  setTickets: (tickets: Ticket[]) => void
  setDonationAmount: (amount: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetPurchase: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [museumId, setMuseumId] = useState<string>('467') // Default museum ID
  const [museum, setMuseum] = useState<Museum | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en')
  const [ticketPrice, setTicketPrice] = useState<number>(5) // Default price
  const [ticketQuantity, setTicketQuantity] = useState<number>(1)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [donationAmount, setDonationAmount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Load translations based on selected language
  const translations = getTranslation(selectedLanguage)

  // Load museum ID and price from localStorage on mount
  useEffect(() => {
    const savedMuseumId = localStorage.getItem('museumId')
    const savedTicketPrice = localStorage.getItem('ticketPrice')
    if (savedMuseumId) {
      setMuseumId(savedMuseumId)
    }
    if (savedTicketPrice) {
      setTicketPrice(parseFloat(savedTicketPrice))
    }
  }, [])

  // Save museum ID to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('museumId', museumId)
  }, [museumId])

  // Save ticket price to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('ticketPrice', ticketPrice.toString())
  }, [ticketPrice])

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading)
  }, [])

  const setErrorCallback = useCallback((error: string | null) => {
    setError(error)
  }, [])

  const resetPurchase = useCallback(() => {
    setTicketQuantity(1)
    setTickets([])
    setDonationAmount(0)
    setError(null)
  }, [])

  const value: AppContextType = {
    // State
    museum,
    museumId,
    selectedLanguage,
    ticketPrice,
    ticketQuantity,
    tickets,
    donationAmount,
    translations,
    isLoading,
    error,
    
    // Actions
    setMuseum,
    setMuseumId,
    setSelectedLanguage,
    setTicketPrice,
    setTicketQuantity,
    setTickets,
    setDonationAmount,
    setLoading,
    setError: setErrorCallback,
    resetPurchase
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
