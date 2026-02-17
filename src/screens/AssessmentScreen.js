import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import ProgressRing from '../components/ProgressRing';

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

const getSeverity = (score) => {
    const maxScore = QUESTIONS.length * 3;
    const percentage = (score / maxScore) * 100;
    if (percentage <= 25) return { level: 'Minimal', color: COLORS.secondary, desc: 'Your responses suggest minimal symptoms. Keep up the great work! 🌟' };
    if (percentage <= 50) return { level: 'Mild', color: COLORS.info, desc: 'Some mild symptoms detected. Consider practicing self-care and mindfulness exercises. 🧘' };
    if (percentage <= 75) return { level: 'Moderate', color: COLORS.accentWarm, desc: 'Moderate symptoms noticed. We recommend talking to a mental health professional. 💛' };
    return { level: 'Severe', color: COLORS.danger, desc: 'Significant symptoms detected. Please consider reaching out to a mental health professional or a crisis helpline. ❤️' };
};

const AssessmentScreen = () => {
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (qId, optionIndex) => {
        setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
    };

    const totalScore = Object.entries(answers).reduce((sum, [qId, optIdx]) => {
        const q = QUESTIONS.find(q => q.id === parseInt(qId));
        return sum + (q ? q.scores[optIdx] : 0);
    }, 0);

    const maxScore = QUESTIONS.length * 3;
    const percentage = Math.round(100 - (totalScore / maxScore) * 100);
    const severity = getSeverity(totalScore);
    const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

    const canGoNext = answers[QUESTIONS[currentQ]?.id] !== undefined;

    if (showResult) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#F5F3FF" />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.resultContent}>
                    <Text style={styles.resultTitle}>Assessment Complete</Text>

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

                        <Text style={styles.resultDesc}>{severity.desc}</Text>

                        {/* Score Breakdown */}
                        <View style={styles.breakdownSection}>
                            <Text style={styles.breakdownTitle}>Score Breakdown</Text>
                            {QUESTIONS.map((q, idx) => {
                                const ansIdx = answers[q.id] ?? 0;
                                const ansScore = q.scores[ansIdx];
                                return (
                                    <View key={q.id} style={styles.breakdownItem}>
                                        <View style={styles.breakdownLeft}>
                                            <Text style={styles.breakdownNum}>Q{idx + 1}</Text>
                                            <View style={styles.breakdownBarBg}>
                                                <View
                                                    style={[
                                                        styles.breakdownBar,
                                                        {
                                                            width: `${(ansScore / 3) * 100}%`,
                                                            backgroundColor: ansScore <= 1 ? COLORS.secondary : ansScore === 2 ? COLORS.accentWarm : COLORS.danger,
                                                        },
                                                    ]}
                                                />
                                            </View>
                                        </View>
                                        <Text style={styles.breakdownScore}>{q.options[ansIdx]}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </GlassCard>

                    <GradientButton
                        title="Take Again"
                        onPress={() => {
                            setAnswers({});
                            setCurrentQ(0);
                            setShowResult(false);
                        }}
                        icon={<Ionicons name="refresh" size={20} color={COLORS.white} />}
                        style={{ marginTop: SPACING.lg }}
                    />

                    <View style={{ height: 30 }} />
                </ScrollView>
            </View>
        );
    }

    const question = QUESTIONS[currentQ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F3FF" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <Text style={styles.title}>Well-being Check</Text>
                <Text style={styles.subtitle}>PHQ-7 Mental Health Assessment</Text>

                {/* Progress */}
                <View style={styles.progressSection}>
                    <View style={styles.progressInfo}>
                        <Text style={styles.progressLabel}>
                            Question {currentQ + 1} of {QUESTIONS.length}
                        </Text>
                        <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
                    </View>
                    <View style={styles.progressBg}>
                        <LinearGradient
                            colors={COLORS.gradientPrimary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.progressFill, { width: `${progress}%` }]}
                        />
                    </View>
                </View>

                {/* Question Card */}
                <GlassCard style={styles.questionCard}>
                    <View style={styles.qNumBadge}>
                        <Text style={styles.qNum}>{currentQ + 1}</Text>
                    </View>
                    <Text style={styles.questionText}>{question.text}</Text>

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
                                        isSelected && styles.optionSelected,
                                        isSelected && { borderColor: COLORS.primary + '60' },
                                    ]}
                                >
                                    <View style={[
                                        styles.optionRadio,
                                        isSelected && { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
                                    ]}>
                                        {isSelected && <View style={styles.radioInner} />}
                                    </View>
                                    <Text style={[
                                        styles.optionText,
                                        isSelected && { color: COLORS.textPrimary },
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
                            <Ionicons name="arrow-back" size={20} color={COLORS.textSecondary} />
                            <Text style={styles.backBtnText}>Back</Text>
                        </TouchableOpacity>
                    )}
                    <View style={{ flex: 1 }} />
                    {currentQ < QUESTIONS.length - 1 ? (
                        <GradientButton
                            title="Next"
                            small
                            onPress={() => canGoNext && setCurrentQ(prev => prev + 1)}
                            colors={canGoNext ? COLORS.gradientPrimary : [COLORS.surfaceLight, COLORS.surfaceLight]}
                            icon={<Ionicons name="arrow-forward" size={16} color={COLORS.white} />}
                        />
                    ) : (
                        <GradientButton
                            title="See Results"
                            small
                            onPress={() => canGoNext && setShowResult(true)}
                            colors={canGoNext ? COLORS.gradientSecondary : [COLORS.surfaceLight, COLORS.surfaceLight]}
                            icon={<Ionicons name="checkmark" size={16} color={COLORS.white} />}
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
});

export default AssessmentScreen;
