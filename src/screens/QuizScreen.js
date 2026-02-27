import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    StatusBar, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { saveQuizResult } from '../services/dbService';

const { width } = Dimensions.get('window');

// 5 dimensions × 4 questions = 20 questions
const getDimensions = (colors) => [
    { key: 'emotional', label: 'Emotional Stability', icon: 'heart', color: colors.moodStressed },
    { key: 'anxiety', label: 'Anxiety Level', icon: 'pulse', color: colors.accent },
    { key: 'social', label: 'Social Engagement', icon: 'people', color: colors.info },
    { key: 'selfPerception', label: 'Self-Perception', icon: 'star', color: colors.primary },
    { key: 'resilience', label: 'Resilience', icon: colors.isDark ? 'shield-checkmark' : 'shield-checkmark-outline', color: colors.secondary },
];

const QUESTIONS = [
    // Emotional Stability
    { id: 1, dim: 'emotional', text: 'I often feel overwhelmed by my emotions for no clear reason.', reversed: true },
    { id: 2, dim: 'emotional', text: 'I can manage my sadness without it consuming my entire day.', reversed: false },
    { id: 3, dim: 'emotional', text: 'My mood changes rapidly and unpredictably throughout the day.', reversed: true },
    { id: 4, dim: 'emotional', text: 'I feel emotionally stable and grounded most of the time.', reversed: false },

    // Anxiety Level
    { id: 5, dim: 'anxiety', text: 'I frequently worry about things that might go wrong in the future.', reversed: true },
    { id: 6, dim: 'anxiety', text: 'I can relax without feeling restless or tense.', reversed: false },
    { id: 7, dim: 'anxiety', text: 'My mind races with anxious thoughts, especially at night.', reversed: true },
    { id: 8, dim: 'anxiety', text: 'I feel calm and at ease in most everyday situations.', reversed: false },

    // Social Engagement
    { id: 9, dim: 'social', text: 'I avoid social gatherings even when I want to attend.', reversed: true },
    { id: 10, dim: 'social', text: 'I enjoy spending time with friends and family regularly.', reversed: false },
    { id: 11, dim: 'social', text: 'I often feel isolated even when surrounded by people.', reversed: true },
    { id: 12, dim: 'social', text: 'I can easily reach out to someone when I need support.', reversed: false },

    // Self-Perception
    { id: 13, dim: 'selfPerception', text: 'I often feel like a failure or that I am not good enough.', reversed: true },
    { id: 14, dim: 'selfPerception', text: 'I have a healthy sense of self-worth and confidence.', reversed: false },
    { id: 15, dim: 'selfPerception', text: 'I frequently compare myself negatively to others.', reversed: true },
    { id: 16, dim: 'selfPerception', text: 'I accept myself, including my imperfections.', reversed: false },

    // Resilience
    { id: 17, dim: 'resilience', text: 'I struggle to bounce back after a setback or disappointment.', reversed: true },
    { id: 18, dim: 'resilience', text: 'I believe I can handle whatever challenges come my way.', reversed: false },
    { id: 19, dim: 'resilience', text: 'Small problems feel like insurmountable obstacles to me.', reversed: true },
    { id: 20, dim: 'resilience', text: 'I learn and grow from difficult experiences.', reversed: false },
];

const SCALE_LABELS = [
    'Strongly\nAgree',
    'Agree',
    'Slightly\nAgree',
    'Neutral',
    'Slightly\nDisagree',
    'Disagree',
    'Strongly\nDisagree',
];

const getScaleColors = (colors) => [
    colors.moodGood, colors.primary, colors.secondary,
    colors.textMuted,
    colors.accentWarm, colors.accent, colors.danger,
];

const getStage = (percentage, colors) => {
    if (percentage >= 75) return {
        stage: 'Thriving', emoji: '🌟', color: colors.primary,
        desc: 'Your mental health is excellent! You show strong emotional balance, healthy social connections, and great resilience. Keep nurturing these strengths!',
        tips: ['Continue your positive habits', 'Help others on their wellness journey', 'Try advanced mindfulness techniques'],
    };
    if (percentage >= 50) return {
        stage: 'Coping', emoji: '🌤️', color: colors.info,
        desc: 'You\'re managing well overall, but there are areas that could use some attention. With small improvements, you can reach an even better state.',
        tips: ['Build a consistent self-care routine', 'Practice gratitude journaling', 'Strengthen your support network'],
    };
    if (percentage >= 25) return {
        stage: 'Struggling', emoji: '🌧️', color: colors.accent,
        desc: 'You\'re going through a tough time. Several aspects of your mental health need attention. Reaching out for support is a sign of strength.',
        tips: ['Talk to a trusted friend or family member', 'Consider professional counseling', 'Start with small daily wellness activities'],
    };
    return {
        stage: 'In Crisis', emoji: '🆘', color: colors.danger,
        desc: 'Your results suggest significant distress. Please know that help is available and you deserve support. Reaching out is the most important step you can take.',
        tips: ['Contact a mental health helpline immediately', 'Speak with a mental health professional', 'Reach out to someone you trust right now'],
    };
};

const QuizScreen = ({ navigation }) => {
    const { colors, shadows, isDark } = useTheme();
    const { user } = useAuth();
    const [phase, setPhase] = useState('intro'); // intro, quiz, results
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [resultsSaved, setResultsSaved] = useState(false);
    const progressAnim = useRef(new Animated.Value(0)).current;

    const dimensions = getDimensions(colors);
    const scaleColors = getScaleColors(colors);
    const question = QUESTIONS[currentQ];
    const progress = ((currentQ + (answers[question?.id] !== undefined ? 1 : 0)) / QUESTIONS.length) * 100;
    const currentDim = dimensions.find(d => d.key === question?.dim);

    const handleSelect = (value) => {
        setAnswers(prev => ({ ...prev, [question.id]: value }));

        // Auto-advance after short delay
        setTimeout(() => {
            if (currentQ < QUESTIONS.length - 1) {
                setCurrentQ(prev => prev + 1);
            }
        }, 400);
    };

    const calculateResults = () => {
        const dimScores = {};
        dimensions.forEach(dim => {
            const dimQs = QUESTIONS.filter(q => q.dim === dim.key);
            let total = 0;
            dimQs.forEach(q => {
                const raw = answers[q.id] ?? 3; // 0-6 scale
                // For reversed questions, agreeing = bad, so flip
                // For normal questions, agreeing = good
                const score = q.reversed ? raw : (6 - raw);
                total += score;
            });
            // Max per dimension = 4 questions × 6 = 24
            dimScores[dim.key] = Math.round((total / 24) * 100);
        });

        const overall = Math.round(
            Object.values(dimScores).reduce((a, b) => a + b, 0) / dimensions.length
        );

        return { dimScores, overall };
    };

    // Save results to Firestore (once) - MOVED OUTSIDE CONDITIONAL BLOCK
    useEffect(() => {
        if (phase === 'results' && user && !resultsSaved) {
            const { dimScores, overall } = calculateResults();
            const stage = getStage(overall, colors);

            setResultsSaved(true);

            saveQuizResult(user.uid, {
                overall,
                dimensions: dimScores,
                stage: stage.stage,
            }).catch(err => console.log('Error saving quiz result:', err));
        }
    }, [phase, user, resultsSaved, colors]);

    // ─── INTRO PHASE ─────────────────────────────────────
    if (phase === 'intro') {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.statusBar} />
                <ScrollView contentContainerStyle={styles.introContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.introIconWrap}>
                        <LinearGradient colors={colors.gradientPrimary} style={[styles.introIcon, shadows.glow]}>
                            <Ionicons name="leaf" size={48} color={colors.white} />
                        </LinearGradient>
                    </View>

                    <Text style={[styles.introTitle, { color: colors.textPrimary }]}>Mental Health{'\n'}Stage Quiz</Text>
                    <Text style={[styles.introSubtitle, { color: colors.textSecondary }]}>
                        Discover where you stand across 5 key dimensions of mental wellness
                    </Text>

                    <View style={styles.dimPreview}>
                        {dimensions.map((dim) => (
                            <View key={dim.key} style={[styles.dimPreviewItem, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                                <View style={[styles.dimDot, { backgroundColor: dim.color }]} />
                                <Ionicons name={dim.icon} size={18} color={dim.color} />
                                <Text style={[styles.dimPreviewText, { color: colors.textPrimary }]}>{dim.label}</Text>
                            </View>
                        ))}
                    </View>

                    <GlassCard style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Ionicons name="time-outline" size={20} color={colors.primary} />
                            <Text style={[styles.infoText, { color: colors.textSecondary }]}>Takes about 3-5 minutes</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="help-circle-outline" size={20} color={colors.primary} />
                            <Text style={[styles.infoText, { color: colors.textSecondary }]}>20 questions, rate on a agree/disagree scale</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
                            <Text style={[styles.infoText, { color: colors.textSecondary }]}>Your answers stay private on your device</Text>
                        </View>
                    </GlassCard>

                    <GradientButton
                        title="Start Quiz"
                        onPress={() => setPhase('quiz')}
                        icon={<Ionicons name="arrow-forward" size={20} color={colors.white} />}
                        style={{ marginTop: SPACING.xl }}
                    />

                    <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
                        ⚕️ This is not a clinical diagnosis. Consult a professional for medical advice.
                    </Text>
                </ScrollView>
            </View>
        );
    }

    // ─── RESULTS PHASE ───────────────────────────────────
    if (phase === 'results') {
        const { dimScores, overall } = calculateResults();
        const stage = getStage(overall, colors);

        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.statusBar} />
                <ScrollView contentContainerStyle={styles.resultContent} showsVerticalScrollIndicator={false}>
                    <Text style={[styles.resultHeader, { color: colors.textPrimary }]}>Your Results</Text>

                    {/* Overall Stage Card */}
                    <GlassCard style={styles.stageCard}>
                        <Text style={styles.stageEmoji}>{stage.emoji}</Text>
                        <Text style={[styles.stageLabel, { color: stage.color }]}>{stage.stage}</Text>
                        <View style={styles.overallScoreWrap}>
                            <Text style={[styles.overallScore, { color: colors.textPrimary }]}>{overall}</Text>
                            <Text style={[styles.overallMax, { color: colors.textMuted }]}>/100</Text>
                        </View>
                        <Text style={[styles.stageDesc, { color: colors.textSecondary }]}>{stage.desc}</Text>
                    </GlassCard>

                    {/* Dimension Breakdown */}
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Dimension Breakdown</Text>
                    {dimensions.map((dim) => {
                        const score = dimScores[dim.key];
                        return (
                            <GlassCard key={dim.key} style={styles.dimCard}>
                                <View style={styles.dimHeader}>
                                    <View style={[styles.dimIconWrap, { backgroundColor: dim.color + '18' }]}>
                                        <Ionicons name={dim.icon} size={20} color={dim.color} />
                                    </View>
                                    <View style={styles.dimInfo}>
                                        <Text style={[styles.dimLabel, { color: colors.textPrimary }]}>{dim.label}</Text>
                                        <Text style={[styles.dimScore, { color: dim.color }]}>{score}%</Text>
                                    </View>
                                </View>
                                <View style={[styles.dimBarBg, { backgroundColor: colors.surfaceLight }]}>
                                    <View style={[styles.dimBarFill, { width: `${score}%`, backgroundColor: dim.color }]} />
                                </View>
                            </GlassCard>
                        );
                    })}

                    {/* Recommendations */}
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recommendations</Text>
                    <GlassCard style={styles.tipsCard}>
                        {stage.tips.map((tip, i) => (
                            <View key={i} style={styles.tipRow}>
                                <View style={[styles.tipNum, { backgroundColor: stage.color + '20' }]}>
                                    <Text style={[styles.tipNumText, { color: stage.color }]}>{i + 1}</Text>
                                </View>
                                <Text style={[styles.tipText, { color: colors.textSecondary }]}>{tip}</Text>
                            </View>
                        ))}
                    </GlassCard>

                    {/* Actions */}
                    <View style={styles.actionBtns}>

                        <GradientButton
                            title="Go to Dashboard"
                            onPress={() =>
                                navigation.navigate("MainTabs", {
                                    screen: "Home",
                                })

                            }
                        />
                        <GradientButton
                            title="Retake Quiz"
                            onPress={() => {
                                setAnswers({});
                                setCurrentQ(0);
                                setPhase('intro');
                            }}
                            icon={<Ionicons name="refresh" size={18} color={colors.white} />}
                            colors={[colors.primary, colors.primary]}
                        />
                        <GradientButton
                            title="Talk to AI"
                            onPress={() =>
                                navigation.navigate('MainTabs', {
                                    screen: 'Chat',
                                })
                            }
                            icon={<Ionicons name="chatbubble" size={18} color={colors.white} />}
                            colors={colors.gradientSecondary}
                            style={{ marginTop: SPACING.md }}
                        />
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        );
    }

    // ─── QUIZ PHASE ──────────────────────────────────────
    const selectedValue = answers[question.id];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.statusBar} />

            {/* Progress Header */}
            <View style={styles.quizHeader}>
                <TouchableOpacity
                    onPress={() => {
                        if (currentQ > 0) setCurrentQ(prev => prev - 1);
                        else setPhase('intro');
                    }}
                    style={[styles.backArrow, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
                >
                    <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.progressArea}>
                    <Text style={[styles.progressText, { color: colors.textMuted }]}>{currentQ + 1} / {QUESTIONS.length}</Text>
                    <View style={[styles.progressBg, { backgroundColor: colors.surfaceLight }]}>
                        <LinearGradient
                            colors={colors.gradientPrimary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.progressFill, { width: `${progress}%` }]}
                        />
                    </View>
                </View>
            </View>

            {/* Dimension Badge */}
            <View style={styles.dimBadgeWrap}>
                <View style={[styles.dimBadge, { backgroundColor: currentDim.color + '15' }]}>
                    <Ionicons name={currentDim.icon} size={16} color={currentDim.color} />
                    <Text style={[styles.dimBadgeText, { color: currentDim.color }]}>{currentDim.label}</Text>
                </View>
            </View>

            {/* Question */}
            <View style={styles.questionArea}>
                <Text style={[styles.questionText, { color: colors.textPrimary }]}>{question.text}</Text>
            </View>

            {/* 7-Point Spectrum */}
            <View style={styles.spectrumArea}>
                <View style={styles.spectrumLabels}>
                    <Text style={[styles.spectrumEnd, { color: scaleColors[0] }]}>Agree</Text>
                    <Text style={[styles.spectrumEnd, { color: scaleColors[6] }]}>Disagree</Text>
                </View>

                <View style={styles.spectrumRow}>
                    {SCALE_LABELS.map((label, idx) => {
                        const isSelected = selectedValue === idx;
                        const baseSize =
                            idx === 0 || idx === 6 ? 48 :
                                idx === 1 || idx === 5 ? 42 :
                                    idx === 2 || idx === 4 ? 36 : 32;

                        return (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => handleSelect(idx)}
                                activeOpacity={0.7}
                                style={styles.spectrumItem}
                            >
                                <View
                                    style={[
                                        styles.spectrumCircle,
                                        {
                                            width: baseSize,
                                            height: baseSize,
                                            borderRadius: baseSize / 2,
                                            backgroundColor: isSelected
                                                ? scaleColors[idx]
                                                : scaleColors[idx] + '20',
                                            borderWidth: isSelected ? 3 : 1,
                                            borderColor: isSelected
                                                ? scaleColors[idx]
                                                : scaleColors[idx] + '40',
                                        },
                                    ]}
                                >
                                    {isSelected && (
                                        <Ionicons
                                            name="checkmark"
                                            size={baseSize * 0.45}
                                            color={colors.white}
                                        />
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.spectrumSubLabels}>
                    {SCALE_LABELS.map((label, idx) => (
                        <Text key={idx} style={[
                            styles.spectrumSubLabel,
                            { color: colors.textMuted },
                            selectedValue === idx && { color: scaleColors[idx], fontWeight: '700' },
                        ]}>
                            {label}
                        </Text>
                    ))}
                </View>
            </View>

            {/* Navigation */}
            <View style={styles.quizNav}>
                {currentQ > 0 && (
                    <TouchableOpacity
                        onPress={() => setCurrentQ(prev => prev - 1)}
                        style={styles.navBackBtn}
                    >
                        <Ionicons name="arrow-back" size={18} color={colors.textSecondary} />
                        <Text style={[styles.navBackText, { color: colors.textSecondary }]}>Previous</Text>
                    </TouchableOpacity>
                )}
                <View style={{ flex: 1 }} />
                {currentQ === QUESTIONS.length - 1 && selectedValue !== undefined && (
                    <GradientButton
                        title="See Results"
                        small
                        onPress={() => setPhase('results')}
                        colors={colors.gradientSecondary}
                        icon={<Ionicons name="checkmark-circle" size={18} color={colors.white} />}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    // ─── Intro ───
    introContent: {
        padding: SPACING.xl,
        paddingTop: SPACING.xxxl + 30,
        alignItems: 'center',
    },
    introIconWrap: {
        marginBottom: SPACING.xxl,
    },
    introIcon: {
        width: 100,
        height: 100,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.glow,
    },
    introTitle: {
        fontSize: FONT_SIZES.hero,
        fontWeight: '800',
        color: COLORS.textPrimary,
        textAlign: 'center',
        lineHeight: 42,
        marginBottom: SPACING.md,
    },
    introSubtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: SPACING.xxl,
        paddingHorizontal: SPACING.lg,
    },
    dimPreview: {
        width: '100%',
        gap: SPACING.md,
        marginBottom: SPACING.xxl,
    },
    dimPreviewItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        backgroundColor: COLORS.surface,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    dimDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    dimPreviewText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
        fontWeight: '600',
    },
    infoCard: {
        gap: SPACING.lg,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    infoText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        flex: 1,
    },
    disclaimer: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginTop: SPACING.xl,
        lineHeight: 16,
        paddingHorizontal: SPACING.xl,
    },

    // ─── Quiz ───
    quizHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: SPACING.xxxl + 15,
        paddingHorizontal: SPACING.xl,
        paddingBottom: SPACING.lg,
        gap: SPACING.md,
    },
    backArrow: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    progressArea: {
        flex: 1,
    },
    progressText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textMuted,
        fontWeight: '600',
        marginBottom: SPACING.xs,
        textAlign: 'right',
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
    dimBadgeWrap: {
        paddingHorizontal: SPACING.xl,
        marginBottom: SPACING.xl,
    },
    dimBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: SPACING.sm,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
    },
    dimBadgeText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
    },
    questionArea: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: SPACING.xxl,
    },
    questionText: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '600',
        color: COLORS.textPrimary,
        lineHeight: 32,
        textAlign: 'center',
    },

    // ─── Spectrum ───
    spectrumArea: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.lg,
    },
    spectrumLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.sm,
        marginBottom: SPACING.md,
    },
    spectrumEnd: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    spectrumRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.xs,
    },
    spectrumItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    spectrumCircle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    spectrumSubLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.xs,
        marginTop: SPACING.sm,
    },
    spectrumSubLabel: {
        fontSize: 9,
        color: COLORS.textMuted,
        textAlign: 'center',
        flex: 1,
        lineHeight: 12,
    },

    // ─── Quiz Nav ───
    quizNav: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
        paddingBottom: SPACING.xxl,
        paddingTop: SPACING.md,
    },
    navBackBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        padding: SPACING.md,
    },
    navBackText: {
        color: COLORS.textSecondary,
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
    },

    // ─── Results ───
    resultContent: {
        padding: SPACING.xl,
        paddingTop: SPACING.xxxl + 20,
    },
    resultHeader: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: '800',
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: SPACING.xxl,
    },
    stageCard: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    stageEmoji: {
        fontSize: 56,
        marginBottom: SPACING.md,
    },
    stageLabel: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: '800',
        marginBottom: SPACING.sm,
    },
    overallScoreWrap: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: SPACING.lg,
    },
    overallScore: {
        fontSize: 48,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    overallMax: {
        fontSize: FONT_SIZES.xl,
        color: COLORS.textMuted,
        fontWeight: '600',
    },
    stageDesc: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.lg,
    },
    dimCard: {
        marginBottom: SPACING.md,
    },
    dimHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    dimIconWrap: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dimInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dimLabel: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    dimScore: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '800',
    },
    dimBarBg: {
        height: 8,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: BORDER_RADIUS.full,
        overflow: 'hidden',
    },
    dimBarFill: {
        height: '100%',
        borderRadius: BORDER_RADIUS.full,
    },
    tipsCard: {
        gap: SPACING.lg,
        marginBottom: SPACING.xxl,
    },
    tipRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    tipNum: {
        width: 28,
        height: 28,
        borderRadius: BORDER_RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tipNumText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '800',
    },
    tipText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        flex: 1,
        lineHeight: 20,
    },
    actionBtns: {
        gap: SPACING.md,
    },
});

export default QuizScreen;