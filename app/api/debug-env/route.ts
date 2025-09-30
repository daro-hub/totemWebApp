import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasSendGridKey: !!process.env.SENDGRID_API_KEY,
    sendGridKeyStartsWithSG: process.env.SENDGRID_API_KEY?.startsWith('SG.'),
    fromEmail: process.env.SENDGRID_FROM_EMAIL,
    nodeEnv: process.env.NODE_ENV
  })
}
