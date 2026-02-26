import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import ProgressRing from '../components/ProgressRing';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { getUserStats } from '../services/dbService';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const SCORE_TO_EMOJI = (score) => {
    if (score >= 80) return '😊';
    if (score >= 60) return '🙂';
    if (score >= 40) return '😐';
    if (score >= 20) return '😔';
    return '😢';
};

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const HomeScreen = ({ navigation }) => {
    const { colors, shadows, isDark } = useTheme();
    const { user, profile } = useAuth();
    const { t } = useLanguage();
    const [stats, setStats] = useState(null);
    const [weeklyData, setWeeklyData] = useState([]);
    const [loadingStats, setLoadingStats] = useState(true);

    const today = new Date();
    const hour = today.getHours();
    const greeting = hour < 12 ? t('goodMorning') : hour < 17 ? t('goodAfternoon') : t('goodEvening');
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const firstName = (profile?.name || user?.displayName || 'there').split(' ')[0];

    const loadStats = useCallback(async () => {
        if (!user) return;
        try {
            setLoadingStats(true);
            const s = await getUserStats(user.uid);
            setStats(s);

            // Build weekly data from recentMoods
            const dayMap = {};
            const now = new Date();
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(now.getDate() - i);
                const dayKey = DAY_KEYS[d.getDay()];
                dayMap[`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`] = {
                    day: t(dayKey),
                    mood: '',
                    score: 0,
                };
            }

            // Fill in data from actual mood entries
            (s.recentMoods || []).forEach(m => {
                const d = new Date(m.timestamp);
                const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
                if (dayMap[key]) {
                    dayMap[key].score = m.score || 50;
                    dayMap[key].mood = SCORE_TO_EMOJI(m.score || 50);
                }
            });

            setWeeklyData(Object.values(dayMap));
        } catch (err) {
            console.log('Error loading stats:', err);
        } finally {
            setLoadingStats(false);
        }
    }, [user, t]);

    // Reload stats when the screen is focused
    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [loadStats])
    );

    const wellnessScore = stats?.avgScore || 0;
    const wellnessMsg = wellnessScore >= 70 ? t('wellnessGood') : wellnessScore >= 40 ? t('wellnessOk') : t('wellnessLow');
    const hasStressPattern = weeklyData.some(d => d.score > 0 && d.score < 40);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.statusBar} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greeting, { color: colors.textPrimary }]}>{greeting}, {firstName} 👋</Text>
                        <Text style={[styles.date, { color: colors.textSecondary }]}>{dateStr}</Text>
                    </View>
                    <TouchableOpacity style={[styles.notifBtn, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                        <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
                        {(stats?.streak === 0 || hasStressPattern) && (
                            <View style={[styles.notifDot, { backgroundColor: colors.danger }]} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Wellness Score Card */}
                <GlassCard style={styles.wellnessCard}>
                    <View style={styles.wellnessContent}>
                        <View style={styles.wellnessLeft}>
                            <Text style={[styles.wellnessTitle, { color: colors.textPrimary }]}>{t('wellnessScore')}</Text>
                            <Text style={[styles.wellnessSubtitle, { color: colors.textSecondary }]}>
                                {wellnessMsg}
                            </Text>
                            {stats && stats.totalMoods > 0 && (
                                <View style={styles.wellnessTrend}>
                                    <Ionicons name={wellnessScore >= 50 ? "trending-up" : "trending-down"} size={16} color={wellnessScore >= 50 ? colors.secondary : colors.danger} />
                                    <Text style={[styles.trendText, { color: wellnessScore >= 50 ? colors.secondary : colors.danger }]}>
                                        {wellnessScore}% {t('fromLastWeek')}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <ProgressRing
                            progress={loadingStats ? 0 : wellnessScore}
                            size={100}
                            strokeWidth={8}
                            color={colors.secondary}
                            label="Score"
                        />
                    </View>
                </GlassCard>

                {/* Stat Cards Row */}
                <View style={styles.statsRow}>
                    <StatCard
                        icon="flame"
                        iconColor={colors.accentWarm}
                        value={loadingStats ? '—' : String(stats?.streak || 0)}
                        label={t('dayStreak')}
                    />
                    <StatCard
                        icon="checkmark-circle"
                        iconColor={colors.secondary}
                        value={loadingStats ? '—' : String(stats?.totalMoods || 0)}
                        label={t('checkIns')}
                    />
                    <StatCard
                        icon="alert-circle"
                        iconColor={colors.accent}
                        value={loadingStats ? '—' : String(stats?.totalAssessments || 0)}
                        label={t('assessments')}
                    />
                </View>

                {/* Weekly Mood Chart */}
                <GlassCard style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('weeklyMood')}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Mood')}>
                            <Text style={[styles.seeAll, { color: colors.primary }]}>{t('seeAll')}</Text>
                        </TouchableOpacity>
                    </View>
                    {loadingStats ? (
                        <ActivityIndicator color={colors.primary} style={{ height: 140 }} />
                    ) : weeklyData.every(d => d.score === 0) ? (
                        <View style={{ height: 140, justifyContent: 'center', alignItems: 'center' }}>
                            <Ionicons name="analytics-outline" size={32} color={colors.textMuted} />
                            <Text style={[styles.dayLabel, { color: colors.textMuted, marginTop: SPACING.sm }]}>{t('noMoodData')}</Text>
                        </View>
                    ) : (
                        <View style={styles.chartContainer}>
                            {weeklyData.map((item, index) => (
                                <View key={index} style={styles.chartBar}>
                                    <Text style={styles.moodEmoji}>{item.mood || '·'}</Text>
                                    <View style={[styles.barBg, { backgroundColor: colors.surfaceLight }]}>
                                        <LinearGradient
                                            colors={item.score > 60 ? colors.gradientSecondary : item.score > 40 ? [colors.info, colors.info] : item.score > 0 ? colors.gradientAccent : ['transparent', 'transparent']}
                                            style={[styles.barFill, { height: `${item.score}%` }]}
                                        />
                                    </View>
                                    <Text style={[styles.dayLabel, { color: colors.textMuted }]}>{item.day}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </GlassCard>

                {/* Alert Card - shows only if stress detected */}
                {hasStressPattern && (
                    <GlassCard
                        style={[styles.alertCard, { borderColor: colors.danger + '20' }]}
                        gradientColors={isDark ? ['rgba(232,168,152,0.15)', 'rgba(232,168,152,0.05)'] : ['rgba(255,71,87,0.12)', 'rgba(255,71,87,0.04)']}
                    >
                        <View style={styles.alertContent}>
                            <View style={[styles.alertIcon, { backgroundColor: colors.danger + '15' }]}>
                                <Ionicons name="warning" size={24} color={colors.danger} />
                            </View>
                            <View style={styles.alertText}>
                                <Text style={[styles.alertTitle, { color: colors.danger }]}>{t('stressDetected')}</Text>
                                <Text style={[styles.alertDesc, { color: colors.textSecondary }]}>
                                    {t('stressMessage')}
                                </Text>
                            </View>
                        </View>
                        <GradientButton
                            title={t('talkToAi')}
                            small
                            colors={colors.gradientAccent}
                            onPress={() => navigation.navigate('Chat')}
                            icon={<Ionicons name="chatbubble" size={14} color={colors.white} />}
                        />
                    </GlassCard>
                )}

                {/* Mental Health Quiz Card */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('Quiz')}
                >
                    <LinearGradient
                        colors={colors.gradientPrimary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.quizCard, shadows.glow]}
                    >
                        <View style={styles.quizLeft}>
                            <Text style={[styles.quizBadge, { color: colors.white }]}>{t('newBadge')}</Text>
                            <Text style={[styles.quizTitle, { color: colors.white }]}>{t('mentalHealthQuiz')}</Text>
                            <Text style={styles.quizDesc}>{t('quizDescription')}</Text>
                            <View style={styles.quizMeta}>
                                <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.7)" />
                                <Text style={styles.quizMetaText}>{t('quizMeta')}</Text>
                            </View>
                        </View>
                        <View style={styles.quizIconWrap}>
                            <Ionicons name="leaf" size={40} color="rgba(255,255,255,0.25)" />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Quick Actions */}
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('quickActions')}</Text>
                <View style={styles.actionsRow}>
                    <QuickAction
                        icon="chatbubble-ellipses"
                        label={t('chat')}
                        color={colors.primary}
                        onPress={() => navigation.navigate('Chat')}
                    />
                    <QuickAction
                        icon="happy"
                        label={t('logMood')}
                        color={colors.secondary}
                        onPress={() => navigation.navigate('Mood')}
                    />
                    <QuickAction
                        icon="clipboard"
                        label={t('survey')}
                        color={colors.accentWarm}
                        onPress={() => navigation.navigate('Assessment')}
                    />
                    <QuickAction
                        icon="library"
                        label={t('resources')}
                        color={colors.info}
                        onPress={() => navigation.navigate('Resources')}
                    />
                </View>

                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    );
};

const QuickAction = ({ icon, label, color, onPress }) => {
    const { colors } = useTheme();
    return (
        <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.7}>
            <LinearGradient
                colors={[color + '20', color + '08']}
                style={[styles.actionGradient, { borderColor: colors.cardBorder }]}
            >
                <Ionicons name={icon} size={26} color={color} />
            </LinearGradient>
            <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>{label}</Text>
        </TouchableOpacity>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    greeting: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '800',
        color: COLORS.textPrimary,
        letterSpacing: 0.3,
    },
    date: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    notifBtn: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    notifDot: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.danger,
    },
    wellnessCard: {
        marginBottom: SPACING.lg,
    },
    wellnessContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    wellnessLeft: {
        flex: 1,
        marginRight: SPACING.lg,
    },
    wellnessTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    wellnessSubtitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        lineHeight: 18,
        marginBottom: SPACING.md,
    },
    wellnessTrend: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    trendText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.secondary,
        fontWeight: '600',
    },
    statsRow: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    chartCard: {
        marginBottom: SPACING.lg,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    seeAll: {
        color: COLORS.primary,
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 140,
    },
    chartBar: {
        alignItems: 'center',
        gap: SPACING.xs,
        flex: 1,
    },
    moodEmoji: {
        fontSize: 16,
    },
    barBg: {
        width: 24,
        height: 80,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: BORDER_RADIUS.sm,
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    barFill: {
        width: '100%',
        borderRadius: BORDER_RADIUS.sm,
    },
    dayLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textMuted,
        fontWeight: '500',
    },
    alertCard: {
        marginBottom: SPACING.xxl,
        borderWidth: 1,
        borderColor: COLORS.danger + '20',
    },
    alertContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    alertIcon: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.danger + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertText: {
        flex: 1,
    },
    alertTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.danger,
        marginBottom: SPACING.xs,
    },
    alertDesc: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        lineHeight: 18,
    },
    quizCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.xl,
        borderRadius: BORDER_RADIUS.xl,
        marginBottom: SPACING.xxl,
        ...SHADOWS.glow,
    },
    quizLeft: {
        flex: 1,
    },
    quizBadge: {
        fontSize: 9,
        fontWeight: '900',
        color: COLORS.white,
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.full,
        alignSelf: 'flex-start',
        marginBottom: SPACING.sm,
        letterSpacing: 1,
        overflow: 'hidden',
    },
    quizTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '800',
        color: COLORS.white,
        marginBottom: SPACING.xs,
    },
    quizDesc: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.75)',
        lineHeight: 18,
        marginBottom: SPACING.md,
    },
    quizMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    quizMetaText: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '600',
    },
    quizIconWrap: {
        width: 70,
        height: 70,
        borderRadius: BORDER_RADIUS.xl,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.lg,
        gap: SPACING.md,
    },
    actionItem: {
        flex: 1,
        alignItems: 'center',
        gap: SPACING.sm,
    },
    actionGradient: {
        width: 60,
        height: 60,
        borderRadius: BORDER_RADIUS.lg,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    actionLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
});

export default HomeScreen;
