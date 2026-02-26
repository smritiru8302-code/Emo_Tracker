import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translate, LANGUAGES } from '../i18n';

const LANG_KEY = '@emo_tracker_language';

const LanguageContext = createContext({});

export const LanguageProvider = ({ children }) => {
    const [language, setLanguageState] = useState('en');
    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved language preference
    useEffect(() => {
        AsyncStorage.getItem(LANG_KEY).then((value) => {
            if (value && LANGUAGES.some(l => l.code === value)) {
                setLanguageState(value);
            }
            setIsLoaded(true);
        }).catch(() => setIsLoaded(true));
    }, []);

    // Persist language preference
    const setLanguage = useCallback(async (langCode) => {
        setLanguageState(langCode);
        try {
            await AsyncStorage.setItem(LANG_KEY, langCode);
        } catch (e) {
            console.log('Error saving language:', e);
        }
    }, []);

    // Translation shorthand
    const t = useCallback((key) => translate(key, language), [language]);

    const value = useMemo(() => ({
        language,
        setLanguage,
        t,
        languages: LANGUAGES,
    }), [language, setLanguage, t]);

    if (!isLoaded) return null;

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
