import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BORDER_RADIUS, SPACING } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';

const GlassCard = ({ children, style, gradientColors, noPadding }) => {
    const { colors, shadows } = useTheme();

    return (
        <View style={[styles.container, { borderColor: colors.cardBorder, ...shadows.card }, style]}>
            <LinearGradient
                colors={gradientColors || colors.gradientCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.gradient, noPadding ? null : styles.padding]}
            >
                {children}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: BORDER_RADIUS.xl,
        borderWidth: 1,
        overflow: 'hidden',
    },
    gradient: {
        borderRadius: BORDER_RADIUS.xl - 1,
    },
    padding: {
        padding: SPACING.xl,
    },
});

export default GlassCard;
