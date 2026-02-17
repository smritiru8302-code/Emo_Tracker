import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, BORDER_RADIUS, FONT_SIZES, SPACING, SHADOWS } from '../styles/theme';

const GradientButton = ({ title, onPress, colors, style, textStyle, icon, small }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={style}>
            <LinearGradient
                colors={colors || COLORS.gradientPrimary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.gradient, small && styles.small, SHADOWS.glow]}
            >
                {icon && icon}
                <Text style={[styles.text, small && styles.smallText, textStyle]}>
                    {title}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.xxl,
        borderRadius: BORDER_RADIUS.xl,
        gap: SPACING.sm,
    },
    small: {
        paddingVertical: SPACING.sm + 2,
        paddingHorizontal: SPACING.lg,
        borderRadius: BORDER_RADIUS.md,
    },
    text: {
        color: COLORS.white,
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    smallText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
    },
});

export default GradientButton;
