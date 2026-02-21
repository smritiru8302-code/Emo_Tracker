import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import ProgressRing from '../components/ProgressRing';
import { useAuth } from '../context/AuthContext';
import { signOutUser } from '../services/authService';

const STATS = [
    { label: 'Total Check-ins', value: '47', icon: 'checkmark-done', color: COLORS.secondary },
    { label: 'Current Streak', value: '7 days', icon: 'flame', color: COLORS.accentWarm },
    { label: 'Assessments', value: '5', icon: 'clipboard', color: COLORS.primary },
    { label: 'Chat Sessions', value: '12', icon: 'chatbubbles', color: COLORS.info },
];

const SETTINGS = [
    {
        section: 'Preferences',
        items: [
            { icon: 'notifications', label: 'Push Notifications', type: 'toggle', key: 'notifications' },
            { icon: 'moon', label: 'Dark Mode', type: 'toggle', key: 'darkMode', defaultOn: true },
            { icon: 'time', label: 'Daily Reminders', type: 'toggle', key: 'reminders' },
            { icon: 'language', label: 'Language', type: 'nav', value: 'English' },
        ],
    },
    {
        section: 'Privacy & Security',
        items: [
            { icon: 'lock-closed', label: 'Data Encryption', type: 'info', value: 'AES-256' },
            { icon: 'eye-off', label: 'Anonymous Mode', type: 'toggle', key: 'anonymous' },
            { icon: 'trash', label: 'Clear Chat History', type: 'action', color: COLORS.danger },
            { icon: 'download', label: 'Export My Data', type: 'action' },
        ],
    },
    {
        section: 'About',
        items: [
            { icon: 'information-circle', label: 'About Emo Tracker', type: 'nav' },
            { icon: 'document-text', label: 'Privacy Policy', type: 'nav' },
            { icon: 'help-circle', label: 'Help & Support', type: 'nav' },
            { icon: 'star', label: 'Rate Us', type: 'nav' },
        ],
    },
];

const ProfileScreen = () => {
    const { user, profile } = useAuth();
    const [toggles, setToggles] = useState({
        notifications: true,
        darkMode: true,
        reminders: false,
        anonymous: false,
    });

    const handleToggle = (key) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleLogout = async () => {
        try {
            await signOutUser();
        } catch (error) {
            console.log('Logout error:', error);
        }
    };

    const displayName = profile?.name || user?.displayName || 'User';
    const displayEmail = user?.email || 'user@email.com';
    const avatarLetter = displayName.charAt(0).toUpperCase();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F5EB" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarSection}>
                        <LinearGradient
                            colors={COLORS.gradientPrimary}
                            style={styles.avatarGradient}
                        >
                            <Text style={styles.avatarText}>{avatarLetter}</Text>
                        </LinearGradient>
                        <View style={styles.editBadge}>
                            <Ionicons name="camera" size={12} color={COLORS.white} />
                        </View>
                    </View>
                    <Text style={styles.userName}>{displayName}</Text>
                    <Text style={styles.userEmail}>{displayEmail}</Text>
                    <View style={styles.memberBadge}>
                        <Ionicons name="shield-checkmark" size={14} color={COLORS.secondary} />
                        <Text style={styles.memberText}>Premium Member</Text>
                    </View>
                </View>

                {/* Wellness Overview */}
                <GlassCard style={styles.overviewCard}>
                    <View style={styles.overviewTop}>
                        <View>
                            <Text style={styles.overviewTitle}>Overall Wellness</Text>
                            <Text style={styles.overviewSubtitle}>Last 30 days</Text>
                        </View>
                        <ProgressRing
                            progress={72}
                            size={80}
                            strokeWidth={7}
                            color={COLORS.secondary}
                        />
                    </View>
                </GlassCard>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {STATS.map((stat, index) => (
                        <View key={index} style={styles.statItem}>
                            <View style={[styles.statIconBg, { backgroundColor: stat.color + '15' }]}>
                                <Ionicons name={stat.icon} size={20} color={stat.color} />
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Settings Sections */}
                {SETTINGS.map((section, sIdx) => (
                    <View key={sIdx} style={styles.settingsSection}>
                        <Text style={styles.sectionTitle}>{section.section}</Text>
                        <View style={styles.settingsList}>
                            {section.items.map((item, iIdx) => (
                                <TouchableOpacity
                                    key={iIdx}
                                    style={[
                                        styles.settingsItem,
                                        iIdx < section.items.length - 1 && styles.settingsItemBorder,
                                    ]}
                                    activeOpacity={item.type === 'toggle' ? 1 : 0.7}
                                >
                                    <View style={[styles.settingsIcon, { backgroundColor: (item.color || COLORS.primary) + '15' }]}>
                                        <Ionicons
                                            name={item.icon}
                                            size={18}
                                            color={item.color || COLORS.primary}
                                        />
                                    </View>
                                    <Text style={[styles.settingsLabel, item.color && { color: item.color }]}>
                                        {item.label}
                                    </Text>
                                    {item.type === 'toggle' && (
                                        <Switch
                                            value={toggles[item.key]}
                                            onValueChange={() => handleToggle(item.key)}
                                            trackColor={{ false: COLORS.surfaceLight, true: COLORS.primary + '50' }}
                                            thumbColor={toggles[item.key] ? COLORS.primary : COLORS.textMuted}
                                        />
                                    )}
                                    {item.type === 'nav' && (
                                        <View style={styles.navRight}>
                                            {item.value && <Text style={styles.navValue}>{item.value}</Text>}
                                            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
                                        </View>
                                    )}
                                    {item.type === 'info' && (
                                        <View style={styles.infoBadge}>
                                            <Text style={styles.infoText}>{item.value}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8} onPress={handleLogout}>
                    <Ionicons name="log-out" size={20} color={COLORS.danger} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.version}>Emo Tracker v1.0.0</Text>

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
    infoBadge: {
        backgroundColor: COLORS.secondary + '15',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.full,
    },
    infoText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.secondary,
        fontWeight: '600',
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
});

export default ProfileScreen;
