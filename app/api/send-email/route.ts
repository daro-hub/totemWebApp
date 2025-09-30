import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// Configura SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    console.log('API Key present:', !!process.env.SENDGRID_API_KEY)
    console.log('API Key starts with SG:', process.env.SENDGRID_API_KEY?.startsWith('SG.'))
    console.log('From email:', process.env.SENDGRID_FROM_EMAIL)
    
    const { email, tickets, translations, museum, orderSummary } = await request.json()
    console.log('Received data:', { email, ticketsCount: tickets?.length, museum: museum?.name })

    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email)
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Crea il contenuto HTML dell'email
    const htmlContent = createEmailHtml(tickets, translations, museum, orderSummary)
    const textContent = createEmailText(tickets, translations, museum, orderSummary)

    // Configura il messaggio
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'em156@amuseapp.it',
      subject: `${translations.emailSubject || 'Your tickets for'} ${museum?.name || 'Museum'}`,
      text: textContent,
      html: htmlContent,
    }

    // Invia l'email
    console.log('Sending email to:', email)
    console.log('Email subject:', msg.subject)
    await sgMail.send(msg)
    console.log('Email sent successfully')

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error sending email:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.body
    })
    return NextResponse.json({ 
      error: 'Failed to send email', 
      details: error.message 
    }, { status: 500 })
  }
}

function createEmailHtml(tickets: any[], translations: any, museum: any, orderSummary: any) {
  const ticketList = tickets.map((ticket, index) => `
    <div style="margin: 20px 0; padding: 20px; border: 2px solid #14b8a6; border-radius: 10px; background-color: #f0fdfa;">
      <h3 style="color: #0f766e; margin: 0 0 10px 0;">${translations.ticket || 'Biglietto'} ${index + 1}</h3>
      <p style="margin: 5px 0; font-family: monospace; font-size: 16px; color: #333;">
        <strong>${translations.ticketCode || 'Codice'}:</strong> ${ticket.code}
      </p>
      <p style="margin: 10px 0; color: #666;">
        <strong>${translations.qrCode || 'QR Code'}:</strong>
      </p>
      <div style="text-align: center; margin: 15px 0;">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticket.qrUrl)}"
             alt="QR Code for ${ticket.code}"
             style="border: 1px solid #ddd; border-radius: 8px; max-width: 200px; height: auto;" />
      </div>
      <p style="margin: 10px 0; font-size: 12px; color: #888; word-break: break-all;">
        <strong>URL:</strong> ${ticket.qrUrl}
      </p>
    </div>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${translations.emailSubject || 'Your tickets'}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #14b8a6; font-size: 28px; margin: 0;">${translations.emailGreeting || 'Hello! Here are your tickets'}</h1>
      </div>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
        <p style="font-size: 16px; margin: 0 0 15px 0;">${translations.emailMessage || 'Thank you for choosing AmuseApp! Enjoy your visit with our interactive audio guide.'}</p>
        <p style="font-size: 14px; color: #666; margin: 0;"><strong>${translations.museumName || 'Museum'}:</strong> ${museum?.name || 'Museum'}</p>
      </div>

      <h2 style="color: #0f766e; font-size: 24px; margin: 30px 0 20px 0; text-align: center;">${translations.yourTickets || 'Your tickets'}</h2>
      
      ${ticketList}

      <div style="background-color: #f0fdfa; padding: 20px; border-radius: 10px; margin: 30px 0;">
        <h3 style="color: #0f766e; margin: 0 0 15px 0; font-size: 18px;">${translations.howToUse || 'How to use your tickets'}</h3>
        <ol style="margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">${translations.step1 || 'Scan the QR code of each ticket at the entrance'}</li>
          <li style="margin-bottom: 8px;">${translations.step2 || 'Open the audio guide on your smartphone'}</li>
          <li style="margin-bottom: 8px;">${translations.step3 || 'Enjoy your visit!'}</li>
        </ol>
      </div>

      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">${translations.emailFooter || 'Thank you for choosing AmuseApp for your visit!'}</p>
        <p style="color: #999; font-size: 12px; margin: 0;">${translations.contactInfo || 'For support: support@amuseapp.it'}</p>
      </div>
    </body>
    </html>
  `
}

function createEmailText(tickets: any[], translations: any, museum: any, orderSummary: any) {
  const ticketList = tickets.map((ticket, index) =>
    `${translations.ticket || 'Biglietto'} ${index + 1}:\n` +
    `  ${translations.ticketCode || 'Codice'}: ${ticket.code}\n` +
    `  ${translations.qrCode || 'QR Code'}: ${translations.attachedFile || 'Allegato'}\n` +
    `  URL: ${ticket.qrUrl}\n`
  ).join('\n')

  return `
${translations.emailGreeting || 'Hello! Here are your tickets'}

${translations.emailMessage || 'Thank you for choosing AmuseApp! Enjoy your visit with our interactive audio guide.'}

${translations.museumName || 'Museum'}: ${museum?.name || 'Museum'}

${translations.yourTickets || 'Your tickets'}:
${ticketList}

${translations.howToUse || 'How to use your tickets'}:
1. ${translations.step1 || 'Scan the QR code of each ticket at the entrance'}
2. ${translations.step2 || 'Open the audio guide on your smartphone'}
3. ${translations.step3 || 'Enjoy your visit!'}

${translations.emailFooter || 'Thank you for choosing AmuseApp for your visit!'}

${translations.contactInfo || 'For support: support@amuseapp.it'}
  `
}
