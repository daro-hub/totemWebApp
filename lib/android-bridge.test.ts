// Test per verificare la funzionalità Android Bridge
// Questo file può essere rimosso in produzione

import { isRunningInAndroidWrapper, createPaymentData, sendPaymentToAndroid } from './android-bridge'

// Test della funzione di rilevamento
console.log('Test Android Bridge:')
console.log('isRunningInAndroidWrapper():', isRunningInAndroidWrapper())

// Test della creazione dati pagamento
const testPaymentData = createPaymentData(15.0, 3, '467')
console.log('Dati pagamento creati:', testPaymentData)

// Test dell'invio (dovrebbe solo loggare se non in wrapper Android)
console.log('Test invio dati pagamento:')
sendPaymentToAndroid(testPaymentData)

// Simula ambiente Android per test
if (typeof window !== 'undefined') {
  // Simula oggetto Android
  ;(window as any).Android = {
    sendPaymentData: (data: string) => {
      console.log('✅ Simulazione Android.sendPaymentData ricevuta:', data)
    }
  }
  
  // Simula AndroidInterface
  ;(window as any).AndroidInterface = {
    onPaymentRequest: (data: string) => {
      console.log('✅ Simulazione AndroidInterface.onPaymentRequest ricevuta:', data)
    }
  }
  
  console.log('Ambiente Android simulato, testando invio:')
  sendPaymentToAndroid(testPaymentData)
}
