import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_COLORS, DARK_COLORS, LIGHT_SHADOWS, DARK_SHADOWS } from '../styles/theme';

const THEME_KEY = '@emo_tracker_theme';

const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved preference
    useEffect(() => {
        AsyncStorage.getItem(THEME_KEY).then((value) => {
            if (value === 'dark') setIsDark(true);
            setIsLoaded(true);
        }).catch(() => setIsLoaded(true));
    }, []);

    // Persist preference
    const toggleTheme = async () => {
        const newValue = !isDark;
        setIsDark(newValue);
        try {
            await AsyncStorage.setItem(THEME_KEY, newValue ? 'dark' : 'light');
        } catch (e) {
            console.log('Error saving theme:', e);
        }
    };

    const theme = useMemo(() => ({
        colors: isDark ? DARK_COLORS : LIGHT_COLORS,
        shadows: isDark ? DARK_SHADOWS : LIGHT_SHADOWS,
        isDark,
        toggleTheme,
    }), [isDark]);

    if (!isLoaded) return null;

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
