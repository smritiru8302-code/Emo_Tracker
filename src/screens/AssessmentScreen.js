import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import ProgressRing from '../components/ProgressRing';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { saveAssessmentResult } from '../services/dbService';

const QUESTIONS = [
    {
        id: 1,
        text: 'Over the past 2 weeks, how often have you felt down, depressed, or hopeless?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        scores: [0, 1, 2, 3],
    },
    {
        id: 2,
        text: 'How often have you had trouble falling or staying asleep, or sleeping too much?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        scores: [0, 1, 2, 3],
    },
    {
        id: 3,
        text: 'How often have you felt tired or had little energy?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        scores: [0, 1, 2, 3],
    },
    {
        id: 4,
        text: 'How often have you had poor appetite or been overeating?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        scores: [0, 1, 2, 3],
    },
    {
        id: 5,
        text: 'How often have you felt bad about yourself — or that you are a failure?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        scores: [0, 1, 2, 3],
    },
    {
        id: 6,
        text: 'How often have you had trouble concentrating on things like reading or watching TV?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        scores: [0, 1, 2, 3],
    },
    {
        id: 7,
        text: 'How often have you felt nervous, anxious, or on edge?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        scores: [0, 1, 2, 3],
    },
];

const getSeverity = (score, colors) => {
    const maxScore = QUESTIONS.length * 3;
    const percentage = (score / maxScore) * 100;
    if (percentage <= 25) return { level: 'Minimal', color: colors.secondary, desc: 'Your responses suggest minimal symptoms. Keep up the great work! 🌟' };
    if (percentage <= 50) return { level: 'Mild', color: colors.info, desc: 'Some mild symptoms detected. Consider practicing self-care and mindfulness exercises. 🧘' };
    if (percentage <= 75) return { level: 'Moderate', color: colors.accentWarm, desc: 'Moderate symptoms noticed. We recommend talking to a mental health professional. 💛' };
    return { level: 'Severe', color: colors.danger, desc: 'Significant symptoms detected. Please consider reaching out to a mental health professional or a crisis helpline. ❤️' };
};

const AssessmentScreen = ({ navigation }) => {
    const { colors, shadows, isDark } = useTheme();
    const { t } = useLanguage();
    const { user } = useAuth();
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleAnswer = (qId, optionIndex) => {
        setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
    };

    const totalScore = Object.entries(answers).reduce((sum, [qId, optIdx]) => {
        const q = QUESTIONS.find(q => q.id === parseInt(qId));
        return sum + (q ? q.scores[optIdx] : 0);
    }, 0);

    const maxScore = QUESTIONS.length * 3;
    const percentage = Math.round(100 - (totalScore / maxScore) * 100);
    const severity = getSeverity(totalScore, colors);
    const progress = ((currentQ + 1) / QUESTIONS.length) * 100;
    const canGoNext = answers[QUESTIONS[currentQ]?.id] !== undefined;

    const handleShowResults = async () => {
        if (!canGoNext) return;
        setShowResult(true);

        // Save to Firestore
        if (user) {
            setSaving(true);
            try {
                await saveAssessmentResult(user.uid, {
                    answers,
                    totalScore,
                    maxScore,
                    percentage,
                    severity: severity.level,
                    questionsCount: QUESTIONS.length,
                });
            } catch (err) {
                console.log('Error saving assessment:', err);
            } finally {
                setSaving(false);
            }
        }
    };

    if (showResult) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.statusBar} />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.resultContent}>
                    <Text style={[styles.resultTitle, { color: colors.textPrimary }]}>{t('yourResults')}</Text>
                    {saving ? null : (
                        <Text style={[styles.savedNote, { color: colors.secondary }]}>{t('resultsSaved')}</Text>
                    )}

                    <GlassCard style={styles.resultCard}>
                        <View style={styles.resultCenter}>
                            <ProgressRing
                                progress={percentage}
                                size={150}
                                strokeWidth={12}
                                color={severity.color}
                                label="Wellness"
                            />
                        </View>

                        <View style={[styles.severityBadge, { backgroundColor: severity.color + '20' }]}>
                            <View style={[styles.severityDot, { backgroundColor: severity.color }]} />
                            <Text style={[styles.severityText, { color: severity.color }]}>
                                {severity.level} Risk Level
                            </Text>
                        </View>

                        <Text style={[styles.resultDesc, { color: colors.textSecondary }]}>{severity.desc}</Text>

                        {/* Score Breakdown */}
                        <View style={styles.breakdownSection}>
                            <Text style={[styles.breakdownTitle, { color: colors.textPrimary }]}>Score Breakdown</Text>
                            {QUESTIONS.map((q, idx) => {
                                const ansIdx = answers[q.id] ?? 0;
                                const ansScore = q.scores[ansIdx];
                                return (
                                    <View key={q.id} style={styles.breakdownItem}>
                                        <View style={styles.breakdownLeft}>
                                            <Text style={[styles.breakdownNum, { color: colors.textMuted }]}>Q{idx + 1}</Text>
                                            <View style={[styles.breakdownBarBg, { backgroundColor: colors.surfaceLight }]}>
                                                <View
                                                    style={[
                                                        styles.breakdownBar,
                                                        {
                                                            width: `${(ansScore / 3) * 100}%`,
                                                            backgroundColor: ansScore <= 1 ? colors.secondary : ansScore === 2 ? colors.accentWarm : colors.danger,
                                                        },
                                                    ]}
                                                />
                                            </View>
                                        </View>
                                        <Text style={[styles.breakdownScore, { color: colors.textSecondary }]}>{q.options[ansIdx]}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </GlassCard>

                    <GradientButton
                        title={t('retake')}
                        onPress={() => {
                            setAnswers({});
                            setCurrentQ(0);
                            setShowResult(false);
                        }}
                        icon={<Ionicons name="refresh" size={20} color={COLORS.white} />}
                        style={{ marginTop: SPACING.lg }}
                    />

                    <TouchableOpacity
                        style={[styles.homeBtn]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={[styles.homeBtnText, { color: colors.primary }]}>{t('goHome')}</Text>
                    </TouchableOpacity>

                    <View style={{ height: 30 }} />
                </ScrollView>
            </View>
        );
    }

    const question = QUESTIONS[currentQ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.statusBar} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <Text style={[styles.title, { color: colors.textPrimary }]}>{t('mentalHealthAssessment')}</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('assessmentSubtitle')}</Text>

                {/* Progress */}
                <View style={styles.progressSection}>
                    <View style={styles.progressInfo}>
                        <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                            {t('question')} {currentQ + 1} {t('of')} {QUESTIONS.length}
                        </Text>
                        <Text style={[styles.progressPercent, { color: colors.primary }]}>{Math.round(progress)}%</Text>
                    </View>
                    <View style={[styles.progressBg, { backgroundColor: colors.surfaceLight }]}>
                        <LinearGradient
                            colors={colors.gradientPrimary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.progressFill, { width: `${progress}%` }]}
                        />
                    </View>
                </View>

                {/* Question Card */}
                <GlassCard style={styles.questionCard}>
                    <View style={[styles.qNumBadge, { backgroundColor: colors.primary + '20' }]}>
                        <Text style={[styles.qNum, { color: colors.primary }]}>{currentQ + 1}</Text>
                    </View>
                    <Text style={[styles.questionText, { color: colors.textPrimary }]}>{question.text}</Text>

                    <View style={styles.optionsContainer}>
                        {question.options.map((option, idx) => {
                            const isSelected = answers[question.id] === idx;
                            return (
                                <TouchableOpacity
                                    key={idx}
                                    onPress={() => handleAnswer(question.id, idx)}
                                    activeOpacity={0.7}
                                    style={[
                                        styles.optionBtn,
                                        { backgroundColor: colors.surfaceLight + '60', borderColor: colors.cardBorder },
                                        isSelected && [styles.optionSelected, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '60' }],
                                    ]}
                                >
                                    <View style={[
                                        styles.optionRadio,
                                        { borderColor: colors.textMuted },
                                        isSelected && { backgroundColor: colors.primary, borderColor: colors.primary },
                                    ]}>
                                        {isSelected && <View style={[styles.radioInner, { backgroundColor: colors.white }]} />}
                                    </View>
                                    <Text style={[
                                        styles.optionText,
                                        { color: colors.textSecondary },
                                        isSelected && { color: colors.textPrimary },
                                    ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </GlassCard>

                {/* Navigation Buttons */}
                <View style={styles.navRow}>
                    {currentQ > 0 && (
                        <TouchableOpacity
                            onPress={() => setCurrentQ(prev => prev - 1)}
                            style={styles.backBtn}
                        >
                            <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
                            <Text style={[styles.backBtnText, { color: colors.textSecondary }]}>{t('back')}</Text>
                        </TouchableOpacity>
                    )}
                    <View style={{ flex: 1 }} />
                    {currentQ < QUESTIONS.length - 1 ? (
                        <GradientButton
                            title={t('next')}
                            small
                            onPress={() => canGoNext && setCurrentQ(prev => prev + 1)}
                            colors={canGoNext ? colors.gradientPrimary : [colors.surfaceLight, colors.surfaceLight]}
                            icon={<Ionicons name="arrow-forward" size={16} color={colors.white} />}
                        />
                    ) : (
                        <GradientButton
                            title={t('submit')}
                            small
                            onPress={handleShowResults}
                            colors={canGoNext ? colors.gradientSecondary : [colors.surfaceLight, colors.surfaceLight]}
                            icon={<Ionicons name="checkmark" size={16} color={colors.white} />}
                        />
                    )}
                </View>
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
    resultContent: {
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
    progressSection: {
        marginBottom: SPACING.xxl,
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
    },
    progressLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    progressPercent: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.primary,
        fontWeight: '700',
    },
    progressBg: {
        height: 6,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: BORDER_RADIUS.full,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: BORDER_RADIUS.full,
    },
    questionCard: {
        marginBottom: SPACING.xxl,
    },
    qNumBadge: {
        width: 36,
        height: 36,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    qNum: {
        color: COLORS.primary,
        fontSize: FONT_SIZES.lg,
        fontWeight: '800',
    },
    questionText: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.textPrimary,
        fontWeight: '500',
        lineHeight: 24,
        marginBottom: SPACING.xxl,
    },
    optionsContainer: {
        gap: SPACING.md,
    },
    optionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        backgroundColor: COLORS.surfaceLight + '60',
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        gap: SPACING.md,
    },
    optionSelected: {
        backgroundColor: COLORS.primary + '12',
    },
    optionRadio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: COLORS.textMuted,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.white,
    },
    optionText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        flex: 1,
        fontWeight: '500',
    },
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        padding: SPACING.md,
    },
    backBtnText: {
        color: COLORS.textSecondary,
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
    },
    // Result styles
    resultTitle: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: '800',
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    savedNote: {
        textAlign: 'center',
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        marginBottom: SPACING.xxl,
    },
    resultCard: {
        alignItems: 'center',
    },
    resultCenter: {
        marginBottom: SPACING.xxl,
    },
    severityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    severityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    severityText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
    },
    resultDesc: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: SPACING.xxl,
        paddingHorizontal: SPACING.lg,
    },
    breakdownSection: {
        width: '100%',
        gap: SPACING.md,
    },
    breakdownTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    breakdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    breakdownLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        flex: 1,
    },
    breakdownNum: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textMuted,
        fontWeight: '700',
        width: 24,
    },
    breakdownBarBg: {
        flex: 1,
        height: 6,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: BORDER_RADIUS.full,
        overflow: 'hidden',
    },
    breakdownBar: {
        height: '100%',
        borderRadius: BORDER_RADIUS.full,
    },
    breakdownScore: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        fontWeight: '500',
        width: 90,
        textAlign: 'right',
    },
    homeBtn: {
        alignItems: 'center',
        paddingVertical: SPACING.lg,
    },
    homeBtnText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
    },
});

export default AssessmentScreen;
