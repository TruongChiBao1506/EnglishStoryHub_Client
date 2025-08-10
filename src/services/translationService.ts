import api from '../utils/api';

export interface TranslationRequest {
  text: string;
  targetLanguage: string;
}

export interface TranslationResponse {
  success: boolean;
  translatedText?: string;
  originalText?: string;
  targetLanguage?: string;
  provider?: 'google' | 'mock';
  message?: string;
}

export type SupportedLanguage = 'vi' | 'zh' | 'ja' | 'ko' | 'th' | 'fr' | 'de' | 'es' | 'ru';

export const SUPPORTED_LANGUAGES = {
  vi: { name: 'Tiếng Việt', flag: '🇻🇳' },
  zh: { name: '中文', flag: '🇨🇳' },
  ja: { name: '日本語', flag: '🇯🇵' },
  ko: { name: '한국어', flag: '🇰🇷' },
  th: { name: 'ไทย', flag: '🇹🇭' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  es: { name: 'Español', flag: '🇪🇸' },
  ru: { name: 'Русский', flag: '🇷🇺' }
} as const;

class TranslationService {
  private cache = new Map<string, string>();
  private audioCache = new Map<string, string>();

  async translateText(text: string, targetLanguage: SupportedLanguage): Promise<TranslationResponse> {
    try {
      // Check cache first
      const cacheKey = `${text}-${targetLanguage}`;
      if (this.cache.has(cacheKey)) {
        return {
          success: true,
          translatedText: this.cache.get(cacheKey)!,
          originalText: text,
          targetLanguage,
          provider: 'mock',
          message: 'Translation from cache'
        };
      }

      const response = await api.post<TranslationResponse>('/translate', {
        text,
        targetLanguage
      });

      if (response.data.success && response.data.translatedText) {
        // Cache the result
        this.cache.set(cacheKey, response.data.translatedText);
        return response.data;
      }

      throw new Error(response.data.message || 'Translation failed');
    } catch (error: any) {
      console.error('Translation error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Translation service unavailable'
      };
    }
  }

  // Text-to-Speech function
  async speakText(text: string, language: string = 'en'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Text-to-speech not supported in this browser'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language based on target
      const languageMap: Record<string, string> = {
        'vi': 'vi-VN',
        'zh': 'zh-CN',
        'ja': 'ja-JP',
        'ko': 'ko-KR',
        'th': 'th-TH',
        'fr': 'fr-FR',
        'de': 'de-DE',
        'es': 'es-ES',
        'ru': 'ru-RU',
        'en': 'en-US'
      };

      utterance.lang = languageMap[language] || 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      window.speechSynthesis.speak(utterance);
    });
  }

  stopSpeaking(): void {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  }

  isSpeaking(): boolean {
    return 'speechSynthesis' in window && window.speechSynthesis.speaking;
  }

  // Get available voices for language
  getVoicesForLanguage(language: string): SpeechSynthesisVoice[] {
    if (!('speechSynthesis' in window)) return [];
    
    const voices = window.speechSynthesis.getVoices();
    const languageMap: Record<string, string[]> = {
      'vi': ['vi', 'vi-VN'],
      'zh': ['zh', 'zh-CN', 'zh-TW'],
      'ja': ['ja', 'ja-JP'],
      'ko': ['ko', 'ko-KR'],
      'th': ['th', 'th-TH'],
      'fr': ['fr', 'fr-FR'],
      'de': ['de', 'de-DE'],
      'es': ['es', 'es-ES'],
      'ru': ['ru', 'ru-RU'],
      'en': ['en', 'en-US', 'en-GB']
    };

    const targetLangs = languageMap[language] || ['en'];
    return voices.filter(voice => 
      targetLangs.some(lang => voice.lang.toLowerCase().includes(lang.toLowerCase()))
    );
  }

  // Get supported languages
  getSupportedLanguages() {
    return Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => ({
      code: code as SupportedLanguage,
      ...info
    }));
  }

  clearCache(): void {
    this.cache.clear();
    this.audioCache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

export const translationService = new TranslationService();
export default translationService;
