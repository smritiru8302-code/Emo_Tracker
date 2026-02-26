import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import MoodBadge, { getMoodConfig } from '../components/MoodBadge';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { saveMoodEntry, getMoodHistory } from '../services/dbService';
import { useFocusEffect } from '@react-navigation/native';

const MOODS = ['happy', 'good', 'neutral', 'sad', 'stressed', 'anxious'];
const MOOD_KEYS = { happy: 'moodHappy', good: 'moodGood', neutral: 'moodNeutral', sad: 'moodSad', stressed: 'moodStressed', anxious: 'moodAnxious' };
const DAY_SHORTS = ['monShort', 'tueShort', 'wedShort', 'thuShort', 'friShort', 'satShort', 'sunShort'];

const getScoreForMood = (mood) => {
    const scores = { happy: 90, good: 75, neutral: 50, sad: 30, stressed: 25, anxious: 20 };
    return scores[mood] || 50;
};

const formatTime = (date, t) => {
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) {
        return `${t('today')}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
        return `${t('yesterday')}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return `${diffDays} ${t('daysAgo')}`;
};

const MoodTrackerScreen = () => {
    const { colors, shadows, isDark } = useTheme();
    const { user } = useAuth();
    const { t } = useLanguage();
    const [selectedMood, setSelectedMood] = useState(null);
    const [note, setNote] = useState('');
    const [logged, setLogged] = useState(false);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const moodConfigs = getMoodConfig(colors);

    const loadHistory = useCallback(async () => {
        if (!user) return;
        try {
            setLoadingHistory(true);
            const entries = await getMoodHistory(user.uid, 20);
            setHistory(entries);
        } catch (err) {
            console.log('Error loading mood history:', err);
        } finally {
            setLoadingHistory(false);
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [loadHistory])
    );

    const handleLog = async () => {
        if (selectedMood && user) {
            try {
                await saveMoodEntry(user.uid, {
                    mood: selectedMood,
                    note: note.trim(),
                    score: getScoreForMood(selectedMood),
                });
                setLogged(true);
                setTimeout(() => setLogged(false), 2000);
                setSelectedMood(null);
                setNote('');
                // Reload history after logging
                loadHistory();
            } catch (error) {
                console.log('Error saving mood:', error);
            }
        }
    };

    // Build weekly chart from real data
    const buildWeeklyData = () => {
        const now = new Date();
        const result = [];
        const dayKeys = ['sunShort', 'monShort', 'tueShort', 'wedShort', 'thuShort', 'friShort', 'satShort'];

        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            d.setHours(0, 0, 0, 0);
            const dayKey = dayKeys[d.getDay()];

            // Find mood entries for this day
            const dayEntries = history.filter(e => {
                const ed = new Date(e.timestamp);
                return ed.getFullYear() === d.getFullYear() && ed.getMonth() === d.getMonth() && ed.getDate() === d.getDate();
            });

            const avgScore = dayEntries.length > 0
                ? Math.round(dayEntries.reduce((s, e) => s + (e.score || 50), 0) / dayEntries.length)
                : 0;

            // Find dominant mood
            const dominantMood = dayEntries.length > 0 ? dayEntries[0].mood : 'neutral';

            result.push({
                day: t(dayKey),
                score: avgScore,
                mood: dominantMood,
            });
        }
        return result;
    };

    const weeklyData = buildWeeklyData();
    const weekAvg = weeklyData.filter(d => d.score > 0).length > 0
        ? Math.round(weeklyData.filter(d => d.score > 0).reduce((s, d) => s + d.score, 0) / weeklyData.filter(d => d.score > 0).length)
        : 0;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.statusBar} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <Text style={[styles.title, { color: colors.textPrimary }]}>{t('moodTracker')}</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('howAreYouFeeling')}</Text>

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
                                        backgroundColor: moodConfigs[mood].color + '20',
                                        borderColor: moodConfigs[mood].color + '50',
                                    },
                                    { borderColor: 'transparent' }
                                ]}
                            >
                                <MoodBadge mood={mood} size="sm" showLabel />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Note Input */}
                    <View style={[styles.noteContainer, { backgroundColor: colors.surfaceLight, borderColor: colors.cardBorder }]}>
                        <TextInput
                            style={[styles.noteInput, { color: colors.textPrimary }]}
                            placeholder={t('addNote')}
                            placeholderTextColor={colors.textMuted}
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
                            colors={selectedMood ? colors.gradientPrimary : [colors.surfaceLight, colors.surfaceLight]}
                            style={styles.logButton}
                        >
                            <Ionicons
                                name={logged ? 'checkmark-circle' : 'add-circle'}
                                size={20}
                                color={colors.white}
                            />
                            <Text style={[styles.logButtonText, { color: colors.white }]}>
                                {logged ? t('logged') : t('logMoodBtn')}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </GlassCard>

                {/* Weekly Chart */}
                <GlassCard style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('thisWeek')}</Text>
                        <View style={[styles.avgBadge, { backgroundColor: colors.primary + '20' }]}>
                            <Text style={[styles.avgText, { color: colors.primary }]}>{t('avg')}: {weekAvg}%</Text>
                        </View>
                    </View>
                    <View style={styles.chartContainer}>
                        {weeklyData.map((item, index) => {
                            const moodConfig = moodConfigs[item.mood] || moodConfigs.neutral;
                            return (
                                <View key={index} style={styles.chartItem}>
                                    <View style={[styles.barContainer, { backgroundColor: colors.surfaceLight }]}>
                                        {item.score > 0 && (
                                            <LinearGradient
                                                colors={[moodConfig.color, moodConfig.color + '60']}
                                                style={[styles.bar, { height: `${item.score}%` }]}
                                            />
                                        )}
                                    </View>
                                    <Text style={[styles.dayText, { color: colors.textMuted }]}>{item.day}</Text>
                                </View>
                            );
                        })}
                    </View>
                </GlassCard>

                {/* History */}
                <View style={styles.historyHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('recentEntries')}</Text>
                </View>

                {loadingHistory ? (
                    <View style={{ padding: SPACING.xxl, alignItems: 'center' }}>
                        <ActivityIndicator color={colors.primary} />
                        <Text style={[styles.dayText, { color: colors.textMuted, marginTop: SPACING.md }]}>{t('loadingMoods')}</Text>
                    </View>
                ) : history.length === 0 ? (
                    <GlassCard style={{ alignItems: 'center', padding: SPACING.xxl }}>
                        <Ionicons name="happy-outline" size={40} color={colors.textMuted} />
                        <Text style={[styles.dayText, { color: colors.textMuted, marginTop: SPACING.md }]}>{t('noEntries')}</Text>
                    </GlassCard>
                ) : (
                    history.map((entry) => {
                        const config = moodConfigs[entry.mood] || moodConfigs.neutral;
                        return (
                            <View key={entry.id} style={styles.historyItem}>
                                <View style={[styles.historyDot, { backgroundColor: config.color }]} />
                                <View style={[styles.historyContent, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                                    <View style={styles.historyTop}>
                                        <Text style={styles.historyEmoji}>{config.emoji}</Text>
                                        <Text style={[styles.historyMood, { color: config.color }]}>
                                            {config.label}
                                        </Text>
                                        <View style={[styles.historyScoreBadge, { backgroundColor: colors.surfaceLight }]}>
                                            <Text style={[styles.historyScore, { color: colors.textSecondary }]}>{entry.score}%</Text>
                                        </View>
                                    </View>
                                    {entry.note ? (
                                        <Text style={[styles.historyNote, { color: colors.textSecondary }]}>{entry.note}</Text>
                                    ) : null}
                                    <Text style={[styles.historyTime, { color: colors.textMuted }]}>{formatTime(entry.timestamp, t)}</Text>
                                </View>
                            </View>
                        );
                    })
                )}

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
