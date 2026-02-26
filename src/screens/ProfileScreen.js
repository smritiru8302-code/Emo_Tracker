import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, StatusBar, Modal, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import ProgressRing from '../components/ProgressRing';
import { useAuth } from '../context/AuthContext';
import { signOutUser } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES } from '../i18n';
import { getUserStats, updateUserProfile } from '../services/dbService';
import { useFocusEffect } from '@react-navigation/native';

const ProfileScreen = () => {
    const { colors, shadows, isDark, toggleTheme } = useTheme();
    const { user, profile } = useAuth();
    const { t, language, setLanguage } = useLanguage();
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [showLangModal, setShowLangModal] = useState(false);
    const [toggles, setToggles] = useState({
        notifications: profile?.settings?.notifications ?? true,
        reminders: profile?.settings?.reminders ?? false,
        anonymous: profile?.settings?.anonymous ?? false,
    });

    const loadStats = useCallback(async () => {
        if (!user) return;
        try {
            setLoadingStats(true);
            const s = await getUserStats(user.uid);
            setStats(s);
        } catch (err) {
            console.log('Error loading stats:', err);
        } finally {
            setLoadingStats(false);
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [loadStats])
    );

    const handleToggle = async (key) => {
        const newVal = !toggles[key];
        setToggles(prev => ({ ...prev, [key]: newVal }));
        // Persist to Firestore
        if (user) {
            try {
                await updateUserProfile(user.uid, {
                    [`settings.${key}`]: newVal,
                });
            } catch (err) {
                console.log('Error saving setting:', err);
            }
        }
    };

    const handleLanguageChange = async (langCode) => {
        setLanguage(langCode);
        setShowLangModal(false);
        // Persist to Firestore
        if (user) {
            try {
                await updateUserProfile(user.uid, { language: langCode });
            } catch (err) {
                console.log('Error saving language:', err);
            }
        }
    };

    const handleLogout = async () => {
        Alert.alert(t('logout'), t('signOutConfirm'), [
            { text: t('cancel'), style: 'cancel' },
            {
                text: t('logout'), style: 'destructive', onPress: async () => {
                    try {
                        await signOutUser();
                    } catch (error) {
                        console.log('Logout error:', error);
                    }
                }
            },
        ]);
    };

    const displayName = profile?.name || user?.displayName || 'User';
    const displayEmail = user?.email || 'user@email.com';
    const avatarLetter = displayName.charAt(0).toUpperCase();
    const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

    const STATS_DATA = [
        { label: t('moodLogs'), value: loadingStats ? '—' : String(stats?.totalMoods || 0), icon: 'checkmark-done', colorKey: 'secondary' },
        { label: t('dayStreak'), value: loadingStats ? '—' : `${stats?.streak || 0}`, icon: 'flame', colorKey: 'accentWarm' },
        { label: t('assessments'), value: loadingStats ? '—' : String(stats?.totalAssessments || 0), icon: 'clipboard', colorKey: 'primary' },
        { label: t('quizzesTaken'), value: loadingStats ? '—' : String(stats?.totalQuizzes || 0), icon: 'school', colorKey: 'info' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.statusBar} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarSection}>
                        <LinearGradient
                            colors={colors.gradientPrimary}
                            style={[styles.avatarGradient, shadows.glow]}
                        >
                            <Text style={[styles.avatarText, { color: colors.white }]}>{avatarLetter}</Text>
                        </LinearGradient>
                        <View style={[styles.editBadge, { backgroundColor: colors.primary, borderColor: colors.background }]}>
                            <Ionicons name="camera" size={12} color={colors.white} />
                        </View>
                    </View>
                    <Text style={[styles.userName, { color: colors.textPrimary }]}>{displayName}</Text>
                    <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{displayEmail}</Text>
                    <View style={[styles.memberBadge, { backgroundColor: colors.secondary + '15' }]}>
                        <Ionicons name="shield-checkmark" size={14} color={colors.secondary} />
                        <Text style={[styles.memberText, { color: colors.secondary }]}>{t('premiumMember')}</Text>
                    </View>
                </View>

                {/* Wellness Overview */}
                <GlassCard style={styles.overviewCard}>
                    <View style={styles.overviewTop}>
                        <View>
                            <Text style={[styles.overviewTitle, { color: colors.textPrimary }]}>{t('overallWellness')}</Text>
                            <Text style={[styles.overviewSubtitle, { color: colors.textSecondary }]}>{t('last30Days')}</Text>
                        </View>
                        <ProgressRing
                            progress={loadingStats ? 0 : (stats?.avgScore || 0)}
                            size={80}
                            strokeWidth={7}
                            color={colors.secondary}
                        />
                    </View>
                </GlassCard>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {STATS_DATA.map((stat, index) => (
                        <View key={index} style={[styles.statItem, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                            <View style={[styles.statIconBg, { backgroundColor: colors[stat.colorKey] + '15' }]}>
                                <Ionicons name={stat.icon} size={20} color={colors[stat.colorKey]} />
                            </View>
                            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stat.value}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Preferences Section */}
                <View style={styles.settingsSection}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('preferences')}</Text>
                    <View style={[styles.settingsList, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                        {/* Notifications */}
                        <View style={[styles.settingsItem, styles.settingsItemBorder, { borderBottomColor: colors.cardBorder }]}>
                            <View style={[styles.settingsIcon, { backgroundColor: colors.primary + '15' }]}>
                                <Ionicons name="notifications" size={18} color={colors.primary} />
                            </View>
                            <Text style={[styles.settingsLabel, { color: colors.textPrimary }]}>{t('pushNotifications')}</Text>
                            <Switch
                                value={toggles.notifications}
                                onValueChange={() => handleToggle('notifications')}
                                trackColor={{ false: colors.surfaceLight, true: colors.primary + '50' }}
                                thumbColor={toggles.notifications ? colors.primary : colors.textMuted}
                            />
                        </View>

                        {/* Dark Mode */}
                        <View style={[styles.settingsItem, styles.settingsItemBorder, { borderBottomColor: colors.cardBorder }]}>
                            <View style={[styles.settingsIcon, { backgroundColor: colors.primary + '15' }]}>
                                <Ionicons name="moon" size={18} color={colors.primary} />
                            </View>
                            <Text style={[styles.settingsLabel, { color: colors.textPrimary }]}>{t('darkMode')}</Text>
                            <Switch
                                value={isDark}
                                onValueChange={toggleTheme}
                                trackColor={{ false: colors.surfaceLight, true: colors.primary + '50' }}
                                thumbColor={isDark ? colors.primary : colors.textMuted}
                            />
                        </View>

                        {/* Daily Reminders */}
                        <View style={[styles.settingsItem, styles.settingsItemBorder, { borderBottomColor: colors.cardBorder }]}>
                            <View style={[styles.settingsIcon, { backgroundColor: colors.primary + '15' }]}>
                                <Ionicons name="time" size={18} color={colors.primary} />
                            </View>
                            <Text style={[styles.settingsLabel, { color: colors.textPrimary }]}>{t('dailyReminders')}</Text>
                            <Switch
                                value={toggles.reminders}
                                onValueChange={() => handleToggle('reminders')}
                                trackColor={{ false: colors.surfaceLight, true: colors.primary + '50' }}
                                thumbColor={toggles.reminders ? colors.primary : colors.textMuted}
                            />
                        </View>

                        {/* Language Selector */}
                        <TouchableOpacity
                            style={styles.settingsItem}
                            onPress={() => setShowLangModal(true)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.settingsIcon, { backgroundColor: colors.primary + '15' }]}>
                                <Ionicons name="language" size={18} color={colors.primary} />
                            </View>
                            <Text style={[styles.settingsLabel, { color: colors.textPrimary }]}>{t('language')}</Text>
                            <View style={styles.navRight}>
                                <Text style={[styles.navValue, { color: colors.textMuted }]}>{currentLang.flag} {currentLang.nativeLabel}</Text>
                                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* About Section */}
                <View style={styles.settingsSection}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('about')}</Text>
                    <View style={[styles.settingsList, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                        {[
                            { icon: 'information-circle', label: t('appName') },
                            { icon: 'document-text', label: t('privacyPolicyNav') },
                            { icon: 'help-circle', label: t('helpSupport') },
                            { icon: 'star', label: t('rateUs') },
                        ].map((item, idx, arr) => (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.settingsItem,
                                    idx < arr.length - 1 && [styles.settingsItemBorder, { borderBottomColor: colors.cardBorder }],
                                ]}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.settingsIcon, { backgroundColor: colors.primary + '15' }]}>
                                    <Ionicons name={item.icon} size={18} color={colors.primary} />
                                </View>
                                <Text style={[styles.settingsLabel, { color: colors.textPrimary }]}>{item.label}</Text>
                                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Logout */}
                <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: colors.danger + '10', borderColor: colors.danger + '20' }]} activeOpacity={0.8} onPress={handleLogout}>
                    <Ionicons name="log-out" size={20} color={colors.danger} />
                    <Text style={[styles.logoutText, { color: colors.danger }]}>{t('logout')}</Text>
                </TouchableOpacity>

                <Text style={[styles.version, { color: colors.textMuted }]}>Emo Tracker v1.0.0</Text>

                <View style={{ height: 30 }} />
            </ScrollView>

            {/* Language Selector Modal */}
            <Modal
                visible={showLangModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowLangModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowLangModal(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{t('language')}</Text>
                        {LANGUAGES.map((lang) => (
                            <TouchableOpacity
                                key={lang.code}
                                style={[
                                    styles.langOption,
                                    { borderColor: colors.cardBorder },
                                    language === lang.code && { backgroundColor: colors.primary + '12', borderColor: colors.primary + '40' },
                                ]}
                                onPress={() => handleLanguageChange(lang.code)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.langFlag}>{lang.flag}</Text>
                                <View style={styles.langInfo}>
                                    <Text style={[styles.langLabel, { color: colors.textPrimary }]}>{lang.nativeLabel}</Text>
                                    <Text style={[styles.langSublabel, { color: colors.textMuted }]}>{lang.label}</Text>
                                </View>
                                {language === lang.code && (
                                    <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                                )}
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={[styles.modalCloseBtn, { backgroundColor: colors.surfaceLight }]}
                            onPress={() => setShowLangModal(false)}
                        >
                            <Text style={[styles.modalCloseBtnText, { color: colors.textSecondary }]}>{t('cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
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
    profileHeader: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    avatarSection: {
        position: 'relative',
        marginBottom: SPACING.lg,
    },
    avatarGradient: {
        width: 90,
        height: 90,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.glow,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: '800',
        color: COLORS.white,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.background,
    },
    userName: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    userEmail: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
    },
    memberBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        backgroundColor: COLORS.secondary + '15',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.full,
    },
    memberText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.secondary,
        fontWeight: '700',
    },
    overviewCard: {
        marginBottom: SPACING.lg,
    },
    overviewTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    overviewTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    overviewSubtitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
        marginBottom: SPACING.xxl,
    },
    statItem: {
        width: '47%',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        alignItems: 'center',
        gap: SPACING.sm,
    },
    statIconBg: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    statLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        fontWeight: '500',
        textAlign: 'center',
    },
    settingsSection: {
        marginBottom: SPACING.xxl,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: SPACING.md,
    },
    settingsList: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.xl,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        overflow: 'hidden',
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        gap: SPACING.md,
    },
    settingsItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.cardBorder,
    },
    settingsIcon: {
        width: 36,
        height: 36,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingsLabel: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        fontWeight: '500',
        color: COLORS.textPrimary,
    },
    navRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    navValue: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textMuted,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        padding: SPACING.lg,
        backgroundColor: COLORS.danger + '10',
        borderRadius: BORDER_RADIUS.xl,
        borderWidth: 1,
        borderColor: COLORS.danger + '20',
        marginBottom: SPACING.lg,
    },
    logoutText: {
        color: COLORS.danger,
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
    },
    version: {
        textAlign: 'center',
        color: COLORS.textMuted,
        fontSize: FONT_SIZES.xs,
        marginBottom: SPACING.lg,
    },
    // Language Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: BORDER_RADIUS.xxl,
        borderTopRightRadius: BORDER_RADIUS.xxl,
        padding: SPACING.xl,
        paddingBottom: 40,
    },
    modalTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
    langOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: 'transparent',
        marginBottom: SPACING.sm,
        gap: SPACING.md,
    },
    langFlag: {
        fontSize: 24,
    },
    langInfo: {
        flex: 1,
    },
    langLabel: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
    },
    langSublabel: {
        fontSize: FONT_SIZES.xs,
    },
    modalCloseBtn: {
        alignItems: 'center',
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.xl,
        marginTop: SPACING.md,
    },
    modalCloseBtnText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
    },
});

export default ProfileScreen;
