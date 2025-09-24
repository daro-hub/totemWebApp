// Mapping dei codici lingua ai codici paese per le bandiere
export const languageToCountryCode = {
  'it': 'IT',    // Italiano → Italia
  'en': 'GB',    // English → Gran Bretagna  
  'fr': 'FR',    // Français → Francia
  'de': 'DE',    // Deutsch → Germania
  'es': 'ES',    // Español → Spagna
  'pt': 'PT',    // Português → Portogallo
  'ru': 'RU',    // Русский → Russia
  'zh': 'CN',    // 中文 → Cina
  'ja': 'JP',    // 日本語 → Giappone
  'ko': 'KR',    // 한국어 → Corea del Sud
  'ar': 'SA',    // العربية → Arabia Saudita
  'hi': 'IN',    // हिन्दी → India
  'nl': 'NL',    // Nederlands → Olanda
  'sv': 'SE',    // Svenska → Svezia
  'no': 'NO',    // Norsk → Norvegia
  'da': 'DK',    // Dansk → Danimarca
  'fi': 'FI',    // Suomi → Finlandia
  'pl': 'PL',    // Polski → Polonia
  'cs': 'CZ',    // Čeština → Repubblica Ceca
  'hu': 'HU',    // Magyar → Ungheria
  'ro': 'RO',    // Română → Romania
  'bg': 'BG',    // Български → Bulgaria
  'hr': 'HR',    // Hrvatski → Croazia
  'sk': 'SK',    // Slovenčina → Slovacchia
  'sl': 'SI',    // Slovenščina → Slovenia
  'et': 'EE',    // Eesti → Estonia
  'lv': 'LV',    // Latviešu → Lettonia
  'lt': 'LT',    // Lietuvių → Lituania
  'el': 'GR',    // Ελληνικά → Grecia
  'tr': 'TR',    // Türkçe → Turchia
  'he': 'IL',    // עברית → Israele
  'th': 'TH',    // ไทย → Thailandia
  'vi': 'VN',    // Tiếng Việt → Vietnam
  'id': 'ID',    // Bahasa Indonesia → Indonesia
  'ms': 'MY',    // Bahasa Melayu → Malesia
  'tl': 'PH',    // Tagalog → Filippine
  'uk': 'UA',    // Українська → Ucraina
  'be': 'BY',    // Беларуская → Bielorussia
  'ka': 'GE',    // ქართული → Georgia
  'hy': 'AM',    // Հայերեն → Armenia
  'az': 'AZ',    // Azərbaycan → Azerbaijan
  'kk': 'KZ',    // Қазақ → Kazakistan
  'ky': 'KG',    // Кыргыз → Kirghizistan
  'uz': 'UZ',    // O'zbek → Uzbekistan
  'tg': 'TJ',    // Тоҷикӣ → Tagikistan
  'mn': 'MN',    // Монгол → Mongolia
  'my': 'MM',    // မြန်မာ → Myanmar
  'km': 'KH',    // ខ្មែរ → Cambogia
  'lo': 'LA',    // ລາວ → Laos
  'si': 'LK',    // සිංහල → Sri Lanka
  'ne': 'NP',    // नेपाली → Nepal
  'bn': 'BD',    // বাংলা → Bangladesh
  'ur': 'PK',    // اردو → Pakistan
  'fa': 'IR',    // فارسی → Iran
  'ps': 'AF',    // پښتو → Afghanistan
  'sd': 'PK',    // سنڌي → Pakistan
  'gu': 'IN',    // ગુજરાતી → India
  'pa': 'IN',    // ਪੰਜਾਬੀ → India
  'ta': 'IN',    // தமிழ் → India
  'te': 'IN',    // తెలుగు → India
  'kn': 'IN',    // ಕನ್ನಡ → India
  'ml': 'IN',    // മലയാളം → India
  'or': 'IN',    // ଓଡ଼ିଆ → India
  'as': 'IN',    // অসমীয়া → India
  'mr': 'IN',    // मराठी → India
  'sa': 'IN',    // संस्कृत → India
  'bo': 'CN',    // བོད་ཡིག → Tibet
  'ug': 'CN',    // ئۇيغۇرچە → Xinjiang
  'za': 'CN',    // 壮语 → Guangxi
  'ii': 'CN',    // ꆈꌠ꒿ → Sichuan
  'yi': 'CN',    // ייִדיש → Yiddish
  'jv': 'ID',    // Basa Jawa → Indonesia
  'su': 'ID',    // Basa Sunda → Indonesia
  'ceb': 'PH',   // Cebuano → Filippine
  'war': 'PH',   // Winaray → Filippine
  'hil': 'PH',   // Ilonggo → Filippine
  'bik': 'PH',   // Bikol → Filippine
  'pam': 'PH',   // Kapampangan → Filippine
  'pag': 'PH',   // Pangasinan → Filippine
  'ilo': 'PH'    // Ilocano → Filippine
}

// Funzione per ottenere il codice paese da un codice lingua
export function getCountryCodeFromLanguage(langCode: string): string {
  let countryCode = languageToCountryCode[langCode.toLowerCase()]
  
  if (!countryCode) {
    // Prova varianti del codice
    const langVariants = [
      langCode.toLowerCase(),
      langCode.substring(0, 2),
      langCode.substring(0, 3)
    ]
    
    for (const variant of langVariants) {
      if (languageToCountryCode[variant]) {
        countryCode = languageToCountryCode[variant]
        break
      }
    }
  }
  
  // Fallback finale
  if (!countryCode && langCode.length === 2) {
    countryCode = langCode.toUpperCase()
  } else if (!countryCode) {
    countryCode = 'IT' // Default Italia
  }
  
  return countryCode
}

// URL per bandiere
export function getFlagUrls(countryCode: string) {
  return {
    flagUrl: `https://flagcdn.com/w1280/${countryCode.toLowerCase()}.png`,
    flagUrl2x: `https://flagcdn.com/w2560/${countryCode.toLowerCase()}.png`,
    flagUrl3x: `https://flagcdn.com/w3840/${countryCode.toLowerCase()}.png`
  }
}
