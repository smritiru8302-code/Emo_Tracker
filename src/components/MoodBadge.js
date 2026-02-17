import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZES } from '../styles/theme';

const MOOD_CONFIG = {
    happy: { emoji: '😊', color: COLORS.moodHappy, label: 'Happy' },
    good: { emoji: '🙂', color: COLORS.moodGood, label: 'Good' },
    neutral: { emoji: '😐', color: COLORS.moodNeutral, label: 'Neutral' },
    sad: { emoji: '😔', color: COLORS.moodSad, label: 'Sad' },
    stressed: { emoji: '😰', color: COLORS.moodStressed, label: 'Stressed' },
    anxious: { emoji: '😟', color: COLORS.moodAnxious, label: 'Anxious' },
};

const MoodBadge = ({ mood, size = 'md', showLabel = true }) => {
    const config = MOOD_CONFIG[mood] || MOOD_CONFIG.neutral;
    const isSmall = size === 'sm';
    const isLarge = size === 'lg';

    return (
        <View style={[styles.container, { borderColor: config.color + '40' }]}>
            <View style={[
                styles.emojiContainer,
                { backgroundColor: config.color + '20' },
                isSmall && styles.emojiSmall,
                isLarge && styles.emojiLarge,
            ]}>
                <Text style={[
                    styles.emoji,
                    isSmall && styles.emojiTextSmall,
                    isLarge && styles.emojiTextLarge,
                ]}>
                    {config.emoji}
                </Text>
            </View>
            {showLabel && (
                <Text style={[styles.label, { color: config.color }]}>
                    {config.label}
                </Text>
            )}
        </View>
    );
};

export { MOOD_CONFIG };

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: SPACING.xs,
    },
    emojiContainer: {
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emojiSmall: {
        width: 36,
        height: 36,
    },
    emojiLarge: {
        width: 64,
        height: 64,
    },
    emoji: {
        fontSize: 24,
    },
    emojiTextSmall: {
        fontSize: 18,
    },
    emojiTextLarge: {
        fontSize: 32,
    },
    label: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});

export default MoodBadge;
