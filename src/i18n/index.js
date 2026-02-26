import en from './en';
import hi from './hi';
import es from './es';
import fr from './fr';
import de from './de';
import zh from './zh';

const translations = { en, hi, es, fr, de, zh };

export const LANGUAGES = [
    { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
    { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'German', nativeLabel: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', label: 'Chinese', nativeLabel: '中文', flag: '🇨🇳' },
];

/**
 * Translate a key for a given language code.
 * Falls back to English if the key is missing.
 */
export const translate = (key, lang = 'en') => {
    const dict = translations[lang] || translations.en;
    return dict[key] || translations.en[key] || key;
};

export default translations;
