export const COLORS = {
    // Core backgrounds — light, airy tones
    background: '#F5F3FF',
    surface: '#FFFFFF',
    surfaceLight: '#EDE9FE',
    card: '#FFFFFF',
    cardBorder: 'rgba(124, 92, 252, 0.10)',

    // Accent colors
    primary: '#7C5CFC',
    primaryLight: '#9B7FFF',
    secondary: '#00D9A6',
    secondaryLight: '#33E8BF',
    accent: '#FF6B9D',
    accentWarm: '#FF9F43',
    info: '#54A0FF',

    // Mood colors
    moodHappy: '#00D9A6',
    moodGood: '#7C5CFC',
    moodNeutral: '#54A0FF',
    moodSad: '#FF9F43',
    moodStressed: '#FF6B9D',
    moodAnxious: '#FF4757',

    // Text — dark text on light backgrounds
    textPrimary: '#1A1A2E',
    textSecondary: 'rgba(26, 26, 46, 0.60)',
    textMuted: 'rgba(26, 26, 46, 0.35)',

    // Utility
    danger: '#FF4757',
    success: '#00D9A6',
    warning: '#FF9F43',
    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(0, 0, 0, 0.15)',

    // Gradients
    gradientPrimary: ['#7C5CFC', '#5A3FD4'],
    gradientSecondary: ['#00D9A6', '#00B389'],
    gradientDark: ['#F5F3FF', '#EDE9FE'],
    gradientCard: ['rgba(124, 92, 252, 0.06)', 'rgba(124, 92, 252, 0.02)'],
    gradientAccent: ['#FF6B9D', '#FF4757'],
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
};

export const FONT_SIZES = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    xxxl: 28,
    hero: 34,
};

export const BORDER_RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 100,
};

export const SHADOWS = {
    card: {
        shadowColor: '#7C5CFC',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 12,
        elevation: 4,
    },
    glow: {
        shadowColor: '#7C5CFC',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 8,
    },
    soft: {
        shadowColor: '#7C5CFC',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
};
