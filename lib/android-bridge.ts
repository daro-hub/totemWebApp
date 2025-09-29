// Android Bridge utilities for communication with Android wrapper

export interface AndroidPaymentData {
  totalPrice: number
  quantity: number
  museumId: string
  timestamp: number
}

/**
 * Rileva se la webapp è in esecuzione dentro un wrapper Android
 * Controlla la presenza di oggetti specifici del wrapper Android
 */
export function isRunningInAndroidWrapper(): boolean {
  // Controlla se esiste l'oggetto window.Android (comune nei wrapper Android)
  if (typeof window !== 'undefined' && (window as any).Android) {
    return true
  }
  
  // Controlla se esiste l'oggetto window.AndroidInterface (altro pattern comune)
  if (typeof window !== 'undefined' && (window as any).AndroidInterface) {
    return true
  }
  
  // Controlla se esiste l'oggetto window.webkit (usato da alcuni wrapper)
  if (typeof window !== 'undefined' && (window as any).webkit) {
    return true
  }
  
  // Controlla user agent per pattern Android
  if (typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent.toLowerCase()
    return userAgent.includes('android') && userAgent.includes('wv') // WebView
  }
  
  return false
}

/**
 * Invia i dati del pagamento all'app Android
 * @param paymentData Dati del pagamento da inviare
 */
export function sendPaymentToAndroid(paymentData: AndroidPaymentData): void {
  if (!isRunningInAndroidWrapper()) {
    console.log('Non in esecuzione in wrapper Android, skip invio dati')
    return
  }

  try {
    // Metodo 1: Chiamata diretta a funzione Android
    if (typeof window !== 'undefined' && (window as any).Android) {
      const android = (window as any).Android
      if (typeof android.sendPaymentData === 'function') {
        android.sendPaymentData(JSON.stringify(paymentData))
        console.log('Dati pagamento inviati tramite Android.sendPaymentData')
        return
      }
    }

    // Metodo 2: Chiamata tramite AndroidInterface
    if (typeof window !== 'undefined' && (window as any).AndroidInterface) {
      const androidInterface = (window as any).AndroidInterface
      if (typeof androidInterface.onPaymentRequest === 'function') {
        androidInterface.onPaymentRequest(JSON.stringify(paymentData))
        console.log('Dati pagamento inviati tramite AndroidInterface.onPaymentRequest')
        return
      }
    }

    // Metodo 3: Chiamata tramite webkit (per wrapper più vecchi)
    if (typeof window !== 'undefined' && (window as any).webkit) {
      const webkit = (window as any).webkit
      if (typeof webkit.messageHandlers !== 'undefined' && webkit.messageHandlers.paymentHandler) {
        webkit.messageHandlers.paymentHandler.postMessage(paymentData)
        console.log('Dati pagamento inviati tramite webkit.messageHandlers')
        return
      }
    }

    // Metodo 4: Fallback - invia tramite postMessage
    if (typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage({
        type: 'PAYMENT_REQUEST',
        data: paymentData
      }, '*')
      console.log('Dati pagamento inviati tramite postMessage')
      return
    }

    console.warn('Nessun metodo di comunicazione Android trovato')
  } catch (error) {
    console.error('Errore nell\'invio dati pagamento ad Android:', error)
  }
}

/**
 * Crea i dati del pagamento da inviare all'Android
 */
export function createPaymentData(
  totalPrice: number,
  quantity: number,
  museumId: string
): AndroidPaymentData {
  return {
    totalPrice,
    quantity,
    museumId,
    timestamp: Date.now()
  }
}
