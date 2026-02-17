import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import MoodBadge, { MOOD_CONFIG } from '../components/MoodBadge';

const MOODS = ['happy', 'good', 'neutral', 'sad', 'stressed', 'anxious'];

const MOCK_HISTORY = [
    { id: '1', mood: 'happy', note: 'Had a great day at work!', time: 'Today, 9:00 AM', score: 85 },
    { id: '2', mood: 'neutral', note: 'Feeling okay, nothing special', time: 'Yesterday, 8:30 PM', score: 55 },
    { id: '3', mood: 'stressed', note: 'Deadline pressure at work', time: 'Yesterday, 2:00 PM', score: 30 },
    { id: '4', mood: 'good', note: 'Morning meditation helped!', time: '2 days ago', score: 72 },
    { id: '5', mood: 'sad', note: 'Missing my friends', time: '3 days ago', score: 35 },
    { id: '6', mood: 'happy', note: 'Completed my workout goal!', time: '4 days ago', score: 90 },
];

const WEEKLY_DATA = [
    { day: 'M', score: 85, mood: 'happy' },
    { day: 'T', score: 70, mood: 'good' },
    { day: 'W', score: 45, mood: 'neutral' },
    { day: 'T', score: 30, mood: 'stressed' },
    { day: 'F', score: 65, mood: 'good' },
    { day: 'S', score: 90, mood: 'happy' },
    { day: 'S', score: 78, mood: 'happy' },
];

const MoodTrackerScreen = () => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [note, setNote] = useState('');
    const [logged, setLogged] = useState(false);

    const handleLog = () => {
        if (selectedMood) {
            setLogged(true);
            setTimeout(() => setLogged(false), 2000);
            setSelectedMood(null);
            setNote('');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F3FF" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <Text style={styles.title}>Mood Tracker</Text>
                <Text style={styles.subtitle}>How are you feeling right now?</Text>

                {/* Mood Selector */}
                <GlassCard style={styles.moodSelector}>
                    <View style={styles.moodsRow}>
                        {MOODS.map((mood) => (
                            <TouchableOpacity
                                key={mood}
                                onPress={() => setSelectedMood(mood)}
                                activeOpacity={0.7}
                                style={[
                                    styles.moodOption,
                                    selectedMood === mood && {
                                        backgroundColor: MOOD_CONFIG[mood].color + '20',
                                        borderColor: MOOD_CONFIG[mood].color + '50',
                                    },
                                ]}
                            >
                                <MoodBadge mood={mood} size="sm" showLabel />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Note Input */}
                    <View style={styles.noteContainer}>
                        <TextInput
                            style={styles.noteInput}
                            placeholder="Add a note about how you're feeling..."
                            placeholderTextColor={COLORS.textMuted}
                            value={note}
                            onChangeText={setNote}
                            multiline
                            maxLength={200}
                        />
                    </View>

                    {/* Log Button */}
                    <TouchableOpacity
                        onPress={handleLog}
                        activeOpacity={0.8}
                        disabled={!selectedMood}
                    >
                        <LinearGradient
                            colors={selectedMood ? COLORS.gradientPrimary : [COLORS.surfaceLight, COLORS.surfaceLight]}
                            style={styles.logButton}
                        >
                            <Ionicons
                                name={logged ? 'checkmark-circle' : 'add-circle'}
                                size={20}
                                color={COLORS.white}
                            />
                            <Text style={styles.logButtonText}>
                                {logged ? 'Logged!' : 'Log Mood'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </GlassCard>

                {/* Weekly Chart */}
                <GlassCard style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.sectionTitle}>This Week</Text>
                        <View style={styles.avgBadge}>
                            <Text style={styles.avgText}>Avg: 66%</Text>
                        </View>
                    </View>
                    <View style={styles.chartContainer}>
                        {WEEKLY_DATA.map((item, index) => {
                            const moodConfig = MOOD_CONFIG[item.mood];
                            return (
                                <View key={index} style={styles.chartItem}>
                                    <View style={styles.barContainer}>
                                        <LinearGradient
                                            colors={[moodConfig.color, moodConfig.color + '60']}
                                            style={[styles.bar, { height: `${item.score}%` }]}
                                        />
                                    </View>
                                    <Text style={styles.dayText}>{item.day}</Text>
                                </View>
                            );
                        })}
                    </View>
                </GlassCard>

                {/* History */}
                <View style={styles.historyHeader}>
                    <Text style={styles.sectionTitle}>Recent Entries</Text>
                </View>

                {MOCK_HISTORY.map((entry) => {
                    const config = MOOD_CONFIG[entry.mood];
                    return (
                        <View key={entry.id} style={styles.historyItem}>
                            <View style={[styles.historyDot, { backgroundColor: config.color }]} />
                            <View style={styles.historyContent}>
                                <View style={styles.historyTop}>
                                    <Text style={styles.historyEmoji}>{config.emoji}</Text>
                                    <Text style={[styles.historyMood, { color: config.color }]}>
                                        {config.label}
                                    </Text>
                                    <View style={styles.historyScoreBadge}>
                                        <Text style={styles.historyScore}>{entry.score}%</Text>
                                    </View>
                                </View>
                                <Text style={styles.historyNote}>{entry.note}</Text>
                                <Text style={styles.historyTime}>{entry.time}</Text>
                            </View>
                        </View>
                    );
                })}

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: SPACING.xl,
        paddingTop: SPACING.xxxl + 20,
    },
    title: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: '800',
        color: COLORS.textPrimary,
        letterSpacing: 0.3,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
        marginBottom: SPACING.xxl,
    },
    moodSelector: {
        marginBottom: SPACING.lg,
    },
    moodsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        marginBottom: SPACING.xl,
    },
    moodOption: {
        width: '30%',
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    noteContainer: {
        backgroundColor: COLORS.surfaceLight,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        marginBottom: SPACING.lg,
    },
    noteInput: {
        color: COLORS.textPrimary,
        fontSize: FONT_SIZES.md,
        padding: SPACING.lg,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    logButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.lg,
        borderRadius: BORDER_RADIUS.xl,
        gap: SPACING.sm,
    },
    logButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
    },
    chartCard: {
        marginBottom: SPACING.xxl,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    avgBadge: {
        backgroundColor: COLORS.primary + '20',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.full,
    },
    avgText: {
        color: COLORS.primary,
        fontSize: FONT_SIZES.xs,
        fontWeight: '700',
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 120,
        gap: SPACING.sm,
    },
    chartItem: {
        flex: 1,
        alignItems: 'center',
        gap: SPACING.sm,
    },
    barContainer: {
        width: '100%',
        height: 100,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: BORDER_RADIUS.sm,
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    bar: {
        width: '100%',
        borderRadius: BORDER_RADIUS.sm,
    },
    dayText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textMuted,
        fontWeight: '600',
    },
    historyHeader: {
        marginBottom: SPACING.lg,
    },
    historyItem: {
        flexDirection: 'row',
        marginBottom: SPACING.lg,
        gap: SPACING.md,
    },
    historyDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginTop: 6,
    },
    historyContent: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    historyTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    historyEmoji: {
        fontSize: 18,
    },
    historyMood: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        flex: 1,
    },
    historyScoreBadge: {
        backgroundColor: COLORS.surfaceLight,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.full,
    },
    historyScore: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    historyNote: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        lineHeight: 18,
        marginBottom: SPACING.sm,
    },
    historyTime: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textMuted,
    },
});

export default MoodTrackerScreen;
