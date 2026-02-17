import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import ProgressRing from '../components/ProgressRing';
import StatCard from '../components/StatCard';

const { width } = Dimensions.get('window');

const MOCK_MOOD_DATA = [
    { day: 'Mon', mood: '😊', score: 80 },
    { day: 'Tue', mood: '🙂', score: 70 },
    { day: 'Wed', mood: '😐', score: 50 },
    { day: 'Thu', mood: '😔', score: 35 },
    { day: 'Fri', mood: '🙂', score: 65 },
    { day: 'Sat', mood: '😊', score: 85 },
    { day: 'Sun', mood: '😊', score: 78 },
];

const HomeScreen = ({ navigation }) => {
    const today = new Date();
    const greeting = today.getHours() < 12 ? 'Good Morning' : today.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F3FF" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>{greeting} 👋</Text>
                        <Text style={styles.date}>{dateStr}</Text>
                    </View>
                    <TouchableOpacity style={styles.notifBtn}>
                        <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
                        <View style={styles.notifDot} />
                    </TouchableOpacity>
                </View>

                {/* Wellness Score Card */}
                <GlassCard style={styles.wellnessCard}>
                    <View style={styles.wellnessContent}>
                        <View style={styles.wellnessLeft}>
                            <Text style={styles.wellnessTitle}>Wellness Score</Text>
                            <Text style={styles.wellnessSubtitle}>
                                Your mental health is looking good today!
                            </Text>
                            <View style={styles.wellnessTrend}>
                                <Ionicons name="trending-up" size={16} color={COLORS.secondary} />
                                <Text style={styles.trendText}>+12% from last week</Text>
                            </View>
                        </View>
                        <ProgressRing
                            progress={78}
                            size={100}
                            strokeWidth={8}
                            color={COLORS.secondary}
                            label="Score"
                        />
                    </View>
                </GlassCard>

                {/* Stat Cards Row */}
                <View style={styles.statsRow}>
                    <StatCard
                        icon="flame"
                        iconColor={COLORS.accentWarm}
                        value="7"
                        label="Day Streak"
                    />
                    <StatCard
                        icon="checkmark-circle"
                        iconColor={COLORS.secondary}
                        value="23"
                        label="Check-ins"
                    />
                    <StatCard
                        icon="alert-circle"
                        iconColor={COLORS.accent}
                        value="2"
                        label="Alerts"
                    />
                </View>

                {/* Weekly Mood Chart */}
                <GlassCard style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.sectionTitle}>Weekly Mood</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.chartContainer}>
                        {MOCK_MOOD_DATA.map((item, index) => (
                            <View key={index} style={styles.chartBar}>
                                <Text style={styles.moodEmoji}>{item.mood}</Text>
                                <View style={styles.barBg}>
                                    <LinearGradient
                                        colors={item.score > 60 ? COLORS.gradientSecondary : item.score > 40 ? [COLORS.info, COLORS.info] : COLORS.gradientAccent}
                                        style={[styles.barFill, { height: `${item.score}%` }]}
                                    />
                                </View>
                                <Text style={styles.dayLabel}>{item.day}</Text>
                            </View>
                        ))}
                    </View>
                </GlassCard>

                {/* Alert Card */}
                <GlassCard
                    style={styles.alertCard}
                    gradientColors={['rgba(255,71,87,0.12)', 'rgba(255,71,87,0.04)']}
                >
                    <View style={styles.alertContent}>
                        <View style={styles.alertIcon}>
                            <Ionicons name="warning" size={24} color={COLORS.danger} />
                        </View>
                        <View style={styles.alertText}>
                            <Text style={styles.alertTitle}>Stress Pattern Detected</Text>
                            <Text style={styles.alertDesc}>
                                We noticed elevated stress levels mid-week. Consider taking a break.
                            </Text>
                        </View>
                    </View>
                    <GradientButton
                        title="Talk to AI"
                        small
                        colors={COLORS.gradientAccent}
                        onPress={() => navigation.navigate('Chat')}
                        icon={<Ionicons name="chatbubble" size={14} color={COLORS.white} />}
                    />
                </GlassCard>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsRow}>
                    <QuickAction
                        icon="chatbubble-ellipses"
                        label="Chat"
                        color={COLORS.primary}
                        onPress={() => navigation.navigate('Chat')}
                    />
                    <QuickAction
                        icon="happy"
                        label="Log Mood"
                        color={COLORS.secondary}
                        onPress={() => navigation.navigate('Mood')}
                    />
                    <QuickAction
                        icon="clipboard"
                        label="Survey"
                        color={COLORS.accentWarm}
                        onPress={() => navigation.navigate('Assessment')}
                    />
                    <QuickAction
                        icon="library"
                        label="Resources"
                        color={COLORS.info}
                        onPress={() => navigation.navigate('Resources')}
                    />
                </View>

                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    );
};

const QuickAction = ({ icon, label, color, onPress }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress} activeOpacity={0.7}>
        <LinearGradient
            colors={[color + '20', color + '08']}
            style={styles.actionGradient}
        >
            <Ionicons name={icon} size={26} color={color} />
        </LinearGradient>
        <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
);

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
