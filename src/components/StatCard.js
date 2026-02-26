import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BORDER_RADIUS, SPACING, FONT_SIZES } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';

const StatCard = ({ icon, iconColor, value, label, gradient }) => {
    const { colors, shadows } = useTheme();
    const gradientColors = gradient || [colors.surfaceLight + 'CC', colors.surface + 'CC'];

    return (
        <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.container, { borderColor: colors.cardBorder, ...shadows.soft }]}
        >
            <View style={[styles.iconWrap, { backgroundColor: (iconColor || colors.primary) + '15' }]}>
                <Ionicons name={icon} size={20} color={iconColor || colors.primary} />
            </View>
            <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.xl,
        alignItems: 'center',
        gap: SPACING.sm,
        borderWidth: 1,
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    value: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '800',
    },
    label: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '500',
    },
});

export default StatCard;
