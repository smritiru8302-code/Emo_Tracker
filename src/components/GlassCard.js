import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from '../styles/theme';

const GlassCard = ({ children, style, gradientColors, noPadding }) => {
    return (
        <View style={[styles.container, style]}>
            <LinearGradient
                colors={gradientColors || COLORS.gradientCard}
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
        borderColor: COLORS.cardBorder,
        overflow: 'hidden',
        ...SHADOWS.card,
    },
    gradient: {
        borderRadius: BORDER_RADIUS.xl - 1,
    },
    padding: {
        padding: SPACING.xl,
    },
});

export default GlassCard;
