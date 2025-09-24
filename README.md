# AmuseKiosk - Museum Totem Web Application

A modern Next.js web application for museum totems that allows users to:
- Select language from 38 supported languages
- Choose ticket quantity
- Confirm payment (graphical only)
- Receive QR code tickets

## 🚀 Features

- **Multi-language Support**: 38 languages including Italian, English, French, German, Spanish, Portuguese, Russian, Chinese, Japanese, Korean, Arabic, Hindi, and many more
- **Responsive Design**: Optimized for vertical tablets
- **PWA Support**: Installable as a Progressive Web App
- **QR Code Generation**: Dynamic ticket generation with QR codes
- **Modern UI**: Built with Tailwind CSS and Shadcn UI components
- **3D Carousel**: Beautiful ticket display with depth effects

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: React Context API
- **Icons**: Lucide React
- **QR Codes**: react-qr-code
- **PWA**: Service Worker + Manifest

## 📱 Pages

- `/` - Language Selector
- `/quantity-selector` - Ticket Quantity Selection
- `/payment-confirm` - Payment Confirmation
- `/thank-you` - QR Code Display & Email Input

## 🌐 Supported Languages

The application supports 38 languages:
- Italian (it), English (en), French (fr), German (de)
- Spanish (es), Portuguese (pt), Russian (ru), Chinese (zh)
- Japanese (ja), Korean (ko), Arabic (ar), Hindi (hi)
- Slovenian (sl), Swedish (sv), Slovak (sk), Hungarian (hu)
- Ukrainian (uk), Polish (pl), Romanian (ro), Danish (da)
- Turkish (tr), Greek (el), Bengali (bn), Dutch (nl)
- Albanian (sq), Indonesian (id), Thai (th), Vietnamese (vi)
- Hebrew (he), Persian (fa), Tagalog (tl), Malay (ms)
- Swahili (sw), Czech (cs), Finnish (fi), Norwegian (no)

## 🔧 API Integration

- **Museum Data API**: Fetches museum information and available languages
- **Ticket Generation API**: Generates unique QR codes for each ticket
- **Fallback System**: Graceful handling of API failures with mock data

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/daro-hub/AmuseKiosk.git
cd AmuseKiosk
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

The application is optimized for deployment on Vercel:

```bash
npm run build
npm start
```

## 📱 PWA Features

- Installable on tablets and mobile devices
- Offline functionality
- Full-screen experience
- Service Worker caching

## 🎨 UI/UX Features

- Rounded corners on all elements
- Vertical tablet optimization
- Smooth animations and transitions
- 3D carousel effect for ticket display
- Auto-return timer functionality

## 🔧 Configuration

- Default Museum ID: 467
- Configurable via invisible settings button
- LocalStorage persistence
- Responsive breakpoints

## 📄 License

This project is proprietary software developed for AmuseApp.

## 👨‍💻 Author

[daro-hub](https://github.com/daro-hub)

---

Built with ❤️ using Next.js and modern web technologies.