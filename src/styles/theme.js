export const COLORS = {
    // Core backgrounds — warm, natural cream tones
    background: '#F5F5EB',
    surface: '#FFFFFF',
    surfaceLight: '#EDF5EE',
    card: '#FFFFFF',
    cardBorder: 'rgba(107, 155, 126, 0.12)',

    // Accent colors — nature-inspired greens
    primary: '#6B9B7E',
    primaryLight: '#8BB89E',
    primaryDark: '#4A7A5E',
    secondary: '#A8C5A0',
    secondaryLight: '#C8DFC2',
    accent: '#E8B86D',
    accentWarm: '#F0C987',
    info: '#7BB5D3',

    // Mood colors — soft, calming tones
    moodHappy: '#8BB89E',
    moodGood: '#A8C5A0',
    moodNeutral: '#B8CCE0',
    moodSad: '#E8B86D',
    moodStressed: '#E09B8A',
    moodAnxious: '#D4837A',

    // Text — warm dark text on light backgrounds
    textPrimary: '#2D3B2F',
    textSecondary: 'rgba(45, 59, 47, 0.60)',
    textMuted: 'rgba(45, 59, 47, 0.35)',

    // Utility
    danger: '#D4837A',
    success: '#6B9B7E',
    warning: '#E8B86D',
    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(45, 59, 47, 0.12)',

    // Gradients
    gradientPrimary: ['#6B9B7E', '#4A7A5E'],
    gradientSecondary: ['#A8C5A0', '#8BB89E'],
    gradientDark: ['#F5F5EB', '#EDF5EE'],
    gradientCard: ['rgba(107, 155, 126, 0.08)', 'rgba(107, 155, 126, 0.02)'],
    gradientAccent: ['#E8B86D', '#D4A24A'],
    gradientWelcome: ['#6B9B7E', '#A8C5A0'],
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
        shadowColor: '#2D3B2F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    glow: {
        shadowColor: '#6B9B7E',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.20,
        shadowRadius: 16,
        elevation: 6,
    },
    soft: {
        shadowColor: '#2D3B2F',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
};
