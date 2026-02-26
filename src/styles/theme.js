// ─── Light Theme Colors ───
export const LIGHT_COLORS = {
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

    // StatusBar
    statusBar: '#F5F5EB',
    statusBarStyle: 'dark-content',
};

// ─── Dark Theme Colors ───
export const DARK_COLORS = {
    // Core backgrounds — deep charcoal with green undertone
    background: '#1A1F1B',
    surface: '#242B26',
    surfaceLight: '#2D352F',
    card: '#242B26',
    cardBorder: 'rgba(139, 184, 158, 0.15)',

    // Accent colors — brighter greens for dark bg contrast
    primary: '#8BB89E',
    primaryLight: '#A8D0B8',
    primaryDark: '#6B9B7E',
    secondary: '#A8C5A0',
    secondaryLight: '#C8DFC2',
    accent: '#F0C987',
    accentWarm: '#F5D9A0',
    info: '#8EC5E0',

    // Mood colors — slightly brighter for dark bg
    moodHappy: '#9ECAB0',
    moodGood: '#B5D4AE',
    moodNeutral: '#A8C0D8',
    moodSad: '#F0C987',
    moodStressed: '#E8A898',
    moodAnxious: '#E09B8A',

    // Text — light text on dark backgrounds
    textPrimary: '#E8EDE9',
    textSecondary: 'rgba(232, 237, 233, 0.65)',
    textMuted: 'rgba(232, 237, 233, 0.35)',

    // Utility
    danger: '#E8A898',
    success: '#8BB89E',
    warning: '#F0C987',
    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(0, 0, 0, 0.30)',

    // Gradients
    gradientPrimary: ['#6B9B7E', '#4A7A5E'],
    gradientSecondary: ['#8BB89E', '#6B9B7E'],
    gradientDark: ['#1A1F1B', '#242B26'],
    gradientCard: ['rgba(139, 184, 158, 0.10)', 'rgba(139, 184, 158, 0.04)'],
    gradientAccent: ['#F0C987', '#E8B86D'],
    gradientWelcome: ['#4A7A5E', '#6B9B7E'],

    // StatusBar
    statusBar: '#1A1F1B',
    statusBarStyle: 'light-content',
};

// Keep COLORS as a default alias for backwards compatibility during migration
export const COLORS = LIGHT_COLORS;

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

export const LIGHT_SHADOWS = {
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

export const DARK_SHADOWS = {
    card: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.20,
        shadowRadius: 12,
        elevation: 4,
    },
    glow: {
        shadowColor: '#8BB89E',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    soft: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
    },
};

// Keep SHADOWS as default alias
export const SHADOWS = LIGHT_SHADOWS;
