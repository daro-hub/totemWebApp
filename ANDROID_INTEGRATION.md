# Integrazione Android - Documentazione

## Panoramica

La webapp è stata modificata per comunicare con l'app Android quando viene premuto il pulsante "Paga". La comunicazione avviene solo quando la webapp è in esecuzione dentro un wrapper Android.

## Modifiche Implementate nella Webapp

### 1. Nuovo File: `lib/android-bridge.ts`

Questo file contiene le funzioni per:
- Rilevare se la webapp è in esecuzione in un wrapper Android
- Inviare i dati del pagamento all'app Android
- Creare i dati del pagamento in formato JSON

### 2. Modifiche a `app/payment-confirm/page.tsx`

La funzione `handlePayNow` è stata modificata per:
- Rilevare se è in esecuzione in wrapper Android
- Inviare i dati del pagamento all'app Android
- Continuare con il flusso normale

## Dati Inviati all'App Android

Quando viene premuto "Paga", vengono inviati i seguenti dati:

```json
{
  "totalPrice": 15.0,
  "quantity": 3,
  "museumId": "467",
  "timestamp": 1703123456789
}
```

## Modifiche Necessarie nell'App Android

### 1. Metodi di Comunicazione Supportati

La webapp prova diversi metodi di comunicazione nell'ordine:

#### Metodo 1: `window.Android.sendPaymentData()`
```javascript
window.Android.sendPaymentData(JSON.stringify(paymentData))
```

**Implementazione Android richiesta:**
```java
@JavascriptInterface
public void sendPaymentData(String paymentDataJson) {
    try {
        JSONObject paymentData = new JSONObject(paymentDataJson);
        double totalPrice = paymentData.getDouble("totalPrice");
        int quantity = paymentData.getInt("quantity");
        String museumId = paymentData.getString("museumId");
        long timestamp = paymentData.getLong("timestamp");
        
        // Gestisci i dati del pagamento
        handlePaymentRequest(totalPrice, quantity, museumId, timestamp);
    } catch (JSONException e) {
        Log.e("AndroidBridge", "Errore parsing dati pagamento", e);
    }
}
```

#### Metodo 2: `window.AndroidInterface.onPaymentRequest()`
```javascript
window.AndroidInterface.onPaymentRequest(JSON.stringify(paymentData))
```

**Implementazione Android richiesta:**
```java
@JavascriptInterface
public void onPaymentRequest(String paymentDataJson) {
    // Stessa logica del metodo 1
}
```

#### Metodo 3: `webkit.messageHandlers.paymentHandler.postMessage()`
```javascript
webkit.messageHandlers.paymentHandler.postMessage(paymentData)
```

**Implementazione Android richiesta:**
```java
// Nel WebViewClient
@Override
public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
    // Gestisci messaggi webkit se necessario
    return super.shouldOverrideUrlLoading(view, request);
}
```

#### Metodo 4: `window.postMessage()` (Fallback)
```javascript
window.parent.postMessage({
    type: 'PAYMENT_REQUEST',
    data: paymentData
}, '*')
```

**Implementazione Android richiesta:**
```java
// Nel WebViewClient
@Override
public void onPageFinished(WebView view, String url) {
    super.onPageFinished(view, url);
    
    // Inietta listener per postMessage
    view.evaluateJavascript(
        "window.addEventListener('message', function(event) {" +
        "  if (event.data.type === 'PAYMENT_REQUEST') {" +
        "    Android.sendPaymentData(JSON.stringify(event.data.data));" +
        "  }" +
        "});", null);
}
```

### 2. Configurazione WebView

Assicurati che il WebView sia configurato per permettere JavaScript e interfacce:

```java
WebView webView = findViewById(R.id.webview);
WebSettings webSettings = webView.getSettings();
webSettings.setJavaScriptEnabled(true);
webSettings.setDomStorageEnabled(true);

// Aggiungi l'interfaccia JavaScript
webView.addJavascriptInterface(new AndroidBridge(), "Android");
webView.addJavascriptInterface(new AndroidBridge(), "AndroidInterface");
```

### 3. Classe AndroidBridge

Crea una classe per gestire la comunicazione:

```java
public class AndroidBridge {
    private static final String TAG = "AndroidBridge";
    
    @JavascriptInterface
    public void sendPaymentData(String paymentDataJson) {
        Log.d(TAG, "Ricevuti dati pagamento: " + paymentDataJson);
        
        try {
            JSONObject paymentData = new JSONObject(paymentDataJson);
            double totalPrice = paymentData.getDouble("totalPrice");
            int quantity = paymentData.getInt("quantity");
            String museumId = paymentData.getString("museumId");
            long timestamp = paymentData.getLong("timestamp");
            
            // Gestisci il pagamento
            handlePaymentRequest(totalPrice, quantity, museumId, timestamp);
            
        } catch (JSONException e) {
            Log.e(TAG, "Errore parsing dati pagamento", e);
        }
    }
    
    @JavascriptInterface
    public void onPaymentRequest(String paymentDataJson) {
        // Stessa implementazione di sendPaymentData
        sendPaymentData(paymentDataJson);
    }
    
    private void handlePaymentRequest(double totalPrice, int quantity, String museumId, long timestamp) {
        // Implementa la logica di pagamento
        // Esempio:
        runOnUiThread(() -> {
            // Mostra dialog di conferma pagamento
            // Avvia processo di pagamento
            // Gestisci risultato
        });
    }
}
```

### 4. Permessi Android

Assicurati di avere i permessi necessari nel `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

### 5. Test della Comunicazione

Per testare la comunicazione:

1. Apri la webapp nel WebView
2. Vai alla pagina di conferma pagamento
3. Premi "Paga"
4. Controlla i log per vedere se i dati vengono ricevuti
5. Verifica che la logica di pagamento venga eseguita

### 6. Gestione Errori

Implementa gestione errori robusta:

```java
@JavascriptInterface
public void sendPaymentData(String paymentDataJson) {
    try {
        // Parsing e gestione dati
    } catch (Exception e) {
        Log.e(TAG, "Errore nella comunicazione con webapp", e);
        // Notifica errore all'utente se necessario
    }
}
```

## Note Importanti

1. **Compatibilità**: La webapp funziona normalmente anche senza wrapper Android
2. **Fallback**: Se nessun metodo di comunicazione funziona, la webapp continua normalmente
3. **Sicurezza**: Valida sempre i dati ricevuti dalla webapp
4. **Performance**: La comunicazione è asincrona e non blocca l'UI
5. **Debug**: Usa i log per monitorare la comunicazione durante lo sviluppo

## Esempio di Implementazione Completa

```java
public class MainActivity extends AppCompatActivity {
    private WebView webView;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        setupWebView();
    }
    
    private void setupWebView() {
        webView = findViewById(R.id.webview);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        
        // Aggiungi interfaccia JavaScript
        webView.addJavascriptInterface(new AndroidBridge(), "Android");
        webView.addJavascriptInterface(new AndroidBridge(), "AndroidInterface");
        
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                // Inietta listener per postMessage se necessario
            }
        });
        
        webView.loadUrl("https://your-webapp-url.com");
    }
}
```

Questa implementazione garantisce che la webapp possa comunicare con l'app Android in modo affidabile e robusto.
