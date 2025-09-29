// API functions for Xano integration

export interface MuseumLanguage {
  language_id: number
  code: string
  name: string
}

export interface Museum {
  name: string
  code: string
  museum_languages: MuseumLanguage[]
  is_church: boolean
}

export interface TicketResponse {
  ticket_code: string
}

// Fetch museum data from Xano API
export async function fetchMuseumData(museumId: string): Promise<Museum> {
  try {
    const response = await fetch(`https://xejn-1dw8-r0nq.f2.xano.io/api:B_gGZXzt/museum_totem?museum_id=${museumId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      console.log(`API returned ${response.status}, using mock data`)
      // Return mock data instead of throwing error
      return getMockMuseumData()
    }

    const data = await response.json()
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log('No museum data found in response, using mock data')
      return getMockMuseumData()
    }

    return data[0] // Return first museum from array
  } catch (error) {
    console.error('Network error fetching museum data:', error)
    console.log('Using mock museum data due to network error')
    return getMockMuseumData()
  }
}

// Helper function to return mock museum data
function getMockMuseumData(): Museum {
  return {
    name: "Test Museum",
    code: "TESTMUSEUM",
    is_church: false,
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
}

// Generate ticket code from Xano API
export async function generateTicketCode(museumCode: string): Promise<string> {
  try {
    console.log('Making API call to Xano with museum_code:', museumCode)
    
    const response = await fetch('https://xejn-1dw8-r0nq.f2.xano.io/api:B_gGZXzt/totem/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        museum_code: museumCode
      })
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const data: TicketResponse = await response.json()
    console.log('API Response data:', data)
    
    if (!data || !data.ticket_code) {
      throw new Error('No ticket code received')
    }

    console.log('Successfully got ticket code:', data.ticket_code)
    return data.ticket_code
  } catch (error) {
    console.error('Error generating ticket code:', error)
    throw new Error('Failed to generate ticket code')
  }
}

// Generate QR URL for ticket
export function generateTicketQRUrl(ticketCode: string, museumId: string): string {
  return `https://web.amuseapp.art/check-in?code=${ticketCode}&museumId=${museumId}`
}

// Generate multiple tickets
export async function generateMultipleTickets(museumCode: string, quantity: number, museumId: string): Promise<Array<{code: string, qrUrl: string}>> {
  const tickets = []
  
  for (let i = 0; i < quantity; i++) {
    try {
      console.log(`--- Generating Ticket ${i + 1}/${quantity} ---`)
      console.log('API Call Payload:', { museum_code: museumCode })
      
      const ticketCode = await generateTicketCode(museumCode)
      console.log('API Response - Ticket Code:', ticketCode)
      
      const qrUrl = generateTicketQRUrl(ticketCode, museumId)
      console.log('Generated QR URL:', qrUrl)
      
      tickets.push({
        code: ticketCode,
        qrUrl: qrUrl
      })
      
      console.log(`--- Ticket ${i + 1} Generated Successfully ---`)
    } catch (error) {
      console.error(`Error generating ticket ${i + 1}:`, error)
      throw new Error(`Failed to generate ticket ${i + 1}`)
    }
  }
  
  return tickets
}
