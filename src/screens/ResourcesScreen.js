import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import GlassCard from '../components/GlassCard';

const RESOURCES = [
    {
        id: '1',
        category: 'Helplines',
        items: [
            {
                title: 'National Crisis Helpline',
                description: '24/7 confidential support for people in distress',
                phone: '988',
                icon: 'call',
                color: COLORS.danger,
                urgent: true,
            },
            {
                title: 'iCall — Psychosocial Help',
                description: 'Free professional counseling service',
                phone: '9152987821',
                icon: 'headset',
                color: COLORS.primary,
            },
            {
                title: 'Vandrevala Foundation',
                description: '24/7 mental health helpline',
                phone: '1860-2662-345',
                icon: 'heart',
                color: COLORS.accent,
            },
        ],
    },
    {
        id: '2',
        category: 'Self-Help',
        items: [
            {
                title: 'Deep Breathing Exercise',
                description: '4-7-8 technique for instant calm. Breathe in for 4s, hold for 7s, exhale for 8s.',
                icon: 'leaf',
                color: COLORS.secondary,
                type: 'exercise',
            },
            {
                title: 'Progressive Muscle Relaxation',
                description: 'Tense and release each muscle group to reduce physical tension.',
                icon: 'body',
                color: COLORS.info,
                type: 'exercise',
            },
            {
                title: 'Grounding Technique — 5-4-3-2-1',
                description: 'Notice 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.',
                icon: 'eye',
                color: COLORS.accentWarm,
                type: 'exercise',
            },
        ],
    },
    {
        id: '3',
        category: 'Articles',
        items: [
            {
                title: 'Understanding Anxiety',
                description: 'Learn what triggers anxiety and how to manage it effectively.',
                icon: 'book',
                color: COLORS.primary,
                type: 'article',
            },
            {
                title: 'Building Resilience',
                description: 'Strategies to strengthen your mental health over time.',
                icon: 'fitness',
                color: COLORS.secondary,
                type: 'article',
            },
            {
                title: 'Sleep Hygiene Guide',
                description: 'Tips for better sleep to improve mental wellness.',
                icon: 'moon',
                color: COLORS.info,
                type: 'article',
            },
        ],
    },
];

const ResourcesScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredResources = RESOURCES.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    })).filter(cat => cat.items.length > 0);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F3FF" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <Text style={styles.title}>Resources</Text>
                <Text style={styles.subtitle}>Support and self-help materials</Text>

                {/* Search */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={COLORS.textMuted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search resources..."
                        placeholderTextColor={COLORS.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Emergency Card */}
                <GlassCard
                    style={styles.emergencyCard}
                    gradientColors={['rgba(255,71,87,0.15)', 'rgba(255,71,87,0.05)']}
                >
                    <View style={styles.emergencyContent}>
                        <View style={styles.emergencyIcon}>
                            <Ionicons name="warning" size={28} color={COLORS.danger} />
                        </View>
                        <View style={styles.emergencyText}>
                            <Text style={styles.emergencyTitle}>In Crisis?</Text>
                            <Text style={styles.emergencyDesc}>
                                If you or someone you know is in immediate danger, please call emergency services.
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => Linking.openURL('tel:112')}
                    >
                        <LinearGradient
                            colors={COLORS.gradientAccent}
                            style={styles.emergencyButton}
                        >
                            <Ionicons name="call" size={18} color={COLORS.white} />
                            <Text style={styles.emergencyBtnText}>Call Emergency (112)</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </GlassCard>

                {/* Resource Categories */}
                {filteredResources.map((category) => (
                    <View key={category.id} style={styles.categorySection}>
                        <Text style={styles.categoryTitle}>{category.category}</Text>
                        {category.items.map((item, index) => (
                            <TouchableOpacity key={index} activeOpacity={0.7}>
                                <View style={[
                                    styles.resourceCard,
                                    item.urgent && { borderColor: COLORS.danger + '30' },
                                ]}>
                                    <View style={[styles.resourceIcon, { backgroundColor: item.color + '15' }]}>
                                        <Ionicons name={item.icon} size={24} color={item.color} />
                                    </View>
                                    <View style={styles.resourceInfo}>
                                        <Text style={styles.resourceTitle}>{item.title}</Text>
                                        <Text style={styles.resourceDesc}>{item.description}</Text>
                                        {item.phone && (
                                            <TouchableOpacity
                                                style={styles.phoneContainer}
                                                onPress={() => Linking.openURL(`tel:${item.phone}`)}
                                            >
                                                <Ionicons name="call" size={14} color={item.color} />
                                                <Text style={[styles.phoneText, { color: item.color }]}>
                                                    {item.phone}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                        {item.type && (
                                            <View style={[styles.typeBadge, { backgroundColor: item.color + '15' }]}>
                                                <Text style={[styles.typeText, { color: item.color }]}>
                                                    {item.type === 'exercise' ? '🧘 Exercise' : '📖 Read'}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}

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
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
        marginBottom: SPACING.xxl,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.xl,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        marginBottom: SPACING.xl,
        gap: SPACING.md,
    },
    searchInput: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: FONT_SIZES.md,
    },
    emergencyCard: {
        marginBottom: SPACING.xxl,
        borderWidth: 1,
        borderColor: COLORS.danger + '25',
    },
    emergencyContent: {
        flexDirection: 'row',
        gap: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    emergencyIcon: {
        width: 56,
        height: 56,
        borderRadius: BORDER_RADIUS.lg,
        backgroundColor: COLORS.danger + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emergencyText: {
        flex: 1,
    },
    emergencyTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '800',
        color: COLORS.danger,
        marginBottom: SPACING.xs,
    },
    emergencyDesc: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        lineHeight: 18,
    },
    emergencyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        gap: SPACING.sm,
    },
    emergencyBtnText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
    },
    categorySection: {
        marginBottom: SPACING.xxl,
    },
    categoryTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.lg,
    },
    resourceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        gap: SPACING.md,
    },
    resourceIcon: {
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resourceInfo: {
        flex: 1,
    },
    resourceTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    resourceDesc: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        lineHeight: 16,
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginTop: SPACING.sm,
    },
    phoneText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
    },
    typeBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.full,
        marginTop: SPACING.sm,
    },
    typeText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
    },
});

export default ResourcesScreen;
