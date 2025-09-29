'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import { fetchMuseumData, Museum } from '@/lib/api'
import { getCountryCodeFromLanguage, getFlagUrls } from '@/lib/languages'
import { Button } from '@/components/ui/Button'
import { MuseumIdDialog } from '@/components/MuseumIdDialog'
import { Logo } from './Logo'
import { PageLayout } from './PageLayout'

interface LanguageButtonProps {
  language: {
    language_id: number
    code: string
    name: string
  }
  onClick: () => void
}

function LanguageButton({ language, onClick }: LanguageButtonProps) {
  const countryCode = getCountryCodeFromLanguage(language.code)
  const flagUrls = getFlagUrls(countryCode)

  return (
    <Button
      variant="outline"
      className="w-full h-32 p-0 bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-200 relative overflow-hidden"
      onClick={onClick}
    >
      {/* Bandiera di sfondo */}
      <img
        src={flagUrls.flagUrl}
        srcSet={`${flagUrls.flagUrl2x} 2x, ${flagUrls.flagUrl3x} 3x`}
        alt={`${language.name} flag`}
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Sfumatura nera per la leggibilità del testo */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      
      {/* Nome della lingua in sovraimpressione nella parte bassa */}
      <span className="absolute bottom-3 left-0 right-0 text-white text-lg font-bold text-center px-2 z-10">
        {language.name}
      </span>
    </Button>
  )
}

export function LanguageSelector() {
  const router = useRouter()
  const { 
    museum, 
    museumId, 
    setMuseum,
    setMuseumId, 
    setSelectedLanguage, 
    setLoading, 
    setError,
    translations,
    isLoading,
    error
  } = useApp()
  
  const [localMuseum, setLocalMuseum] = useState<Museum | null>(null)
  const [loadedMuseumId, setLoadedMuseumId] = useState<string | null>(null)
  
  const [showMuseumDialog, setShowMuseumDialog] = useState(false)

  // Fetch museum data when museumId changes
  useEffect(() => {
    const loadMuseumData = async () => {
      if (!museumId || museumId === loadedMuseumId) return
      
      setLoading(true)
      setError(null)
      
      const museumData = await fetchMuseumData(museumId)
      setLocalMuseum(museumData)
      setMuseum(museumData) // Save to global context
      setLoadedMuseumId(museumId)
      console.log('Museum data loaded:', museumData)
      
      setLoading(false)
    }

    loadMuseumData()
  }, [museumId, loadedMuseumId, setMuseum, setLoading, setError]) // Include setMuseum in dependencies

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode)
    router.push('/quantity-selector')
  }

  const handleSettingsClick = () => {
    setShowMuseumDialog(true)
  }

  // Mock museum data for development - in production this comes from API
  const mockMuseum = {
    name: "Test Museum",
    code: "TESTMUSEUM",
    museum_languages: [
      { language_id: 2, code: "en", name: "English" },
      { language_id: 1, code: "it", name: "Italiano" },
      { language_id: 6, code: "fr", name: "Français" },
      { language_id: 7, code: "de", name: "Deutsch" },
      { language_id: 5, code: "es", name: "Español" },
      { language_id: 9, code: "pt", name: "Português" },
      { language_id: 15, code: "ru", name: "Русский" },
      { language_id: 10, code: "zh", name: "中国人 Chinese" },
      { language_id: 16, code: "sl", name: "slovenščina" },
      { language_id: 11, code: "ja", name: "日本語 Japanese" },
      { language_id: 13, code: "ar", name: "عربي Arabic" },
      { language_id: 38, code: "hi", name: "हिन्दी" }
    ]
  }

  const availableLanguages = localMuseum?.museum_languages || mockMuseum.museum_languages

  return (
    <div className="relative">
      {/* Settings Button - Invisible clickable area in top right */}
      <div className="absolute top-4 right-4 w-12 h-12 z-10">
        <button
          onClick={handleSettingsClick}
          className="w-full h-full opacity-0 cursor-pointer"
          aria-label="Settings"
        />
      </div>

      <PageLayout
        title={translations.selectLanguage}
        subtitle="Choose your preferred language"
      >
        {/* Loading State */}
        {isLoading && (
          <div className="text-white text-center text-xl">
            Loading museum data...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-red-400 text-center mb-4 text-xl">
            {error}
          </div>
        )}

        {/* Language Grid */}
        {!isLoading && (
          <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
            {availableLanguages.map((language, index) => (
              <LanguageButton
                key={`${language.language_id}-${language.code}-${index}`}
                language={language}
                onClick={() => handleLanguageSelect(language.code)}
              />
            ))}
          </div>
        )}
      </PageLayout>

      {/* Museum ID Dialog */}
      <MuseumIdDialog
        open={showMuseumDialog}
        onOpenChange={setShowMuseumDialog}
      />
    </div>
  )
}
