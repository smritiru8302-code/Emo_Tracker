import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../styles/theme';

const StatCard = ({ icon, iconColor, value, label, gradient }) => {
    const gradientColors = gradient || [COLORS.surfaceLight + 'CC', COLORS.surface + 'CC'];

    return (
        <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.container, SHADOWS.soft]}
        >
            <View style={[styles.iconBg, { backgroundColor: (iconColor || COLORS.primary) + '20' }]}>
                <Ionicons
                    name={icon || 'analytics'}
                    size={20}
                    color={iconColor || COLORS.primary}
                />
            </View>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        alignItems: 'center',
        gap: SPACING.sm,
    },
    iconBg: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    value: {
        color: COLORS.textPrimary,
        fontSize: FONT_SIZES.xl,
        fontWeight: '800',
    },
    label: {
        color: COLORS.textSecondary,
        fontSize: FONT_SIZES.xs,
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default StatCard;
