import React from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';
import GradientButton from '../components/GradientButton';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
    return (
        <LinearGradient
            colors={['#F5F3FF', '#EDE9FE', '#E8E0FF']}
            style={styles.container}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#F5F3FF" />

            {/* Decorative circles */}
            <View style={styles.circle1} />
            <View style={styles.circle2} />
            <View style={styles.circle3} />

            {/* Logo Area */}
            <View style={styles.logoSection}>
                <View style={styles.logoContainer}>
                    <LinearGradient
                        colors={COLORS.gradientPrimary}
                        style={styles.logoGradient}
                    >
                        <Ionicons name="brain" size={48} color={COLORS.white} />
                    </LinearGradient>
                </View>
                <Text style={styles.appName}>Emo Tracker</Text>
                <Text style={styles.tagline}>AI-Powered Mental Wellness</Text>
            </View>

            {/* Feature Highlights */}
            <View style={styles.featuresSection}>
                <FeatureItem
                    icon="chatbubble-ellipses"
                    color={COLORS.primary}
                    title="AI Conversations"
                    description="Talk to our empathetic AI chatbot anytime"
                />
                <FeatureItem
                    icon="analytics"
                    color={COLORS.secondary}
                    title="Mood Tracking"
                    description="Monitor your emotional well-being daily"
                />
                <FeatureItem
                    icon="shield-checkmark"
                    color={COLORS.accent}
                    title="Early Detection"
                    description="Identify stress patterns early on"
                />
            </View>

            {/* CTA */}
            <View style={styles.ctaSection}>
                <GradientButton
                    title="Get Started"
                    onPress={() => navigation.replace('Login')}
                    icon={<Ionicons name="arrow-forward" size={20} color={COLORS.white} />}
                />
                <Text style={styles.disclaimer}>
                    🔒 Your data is encrypted and private
                </Text>
            </View>
        </LinearGradient>
    );
};

const FeatureItem = ({ icon, color, title, description }) => (
    <View style={styles.featureItem}>
        <View style={[styles.featureIcon, { backgroundColor: color + '15' }]}>
            <Ionicons name={icon} size={22} color={color} />
        </View>
        <View style={styles.featureText}>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureDesc}>{description}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SPACING.xxl,
        justifyContent: 'space-between',
        paddingTop: height * 0.08,
        paddingBottom: height * 0.05,
    },
    circle1: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: COLORS.primary + '08',
        top: -80,
        right: -100,
    },
    circle2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: COLORS.secondary + '06',
        bottom: 100,
        left: -60,
    },
    circle3: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: COLORS.accent + '05',
        top: height * 0.4,
        right: -40,
    },
    logoSection: {
        alignItems: 'center',
        gap: SPACING.md,
    },
    logoContainer: {
        marginBottom: SPACING.md,
    },
    logoGradient: {
        width: 90,
        height: 90,
        borderRadius: BORDER_RADIUS.xxl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appName: {
        fontSize: FONT_SIZES.hero,
        fontWeight: '800',
        color: COLORS.textPrimary,
        letterSpacing: 1,
    },
    tagline: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.textSecondary,
        fontWeight: '400',
    },
    featuresSection: {
        gap: SPACING.xl,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.lg,
        backgroundColor: COLORS.surface + '80',
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureText: {
        flex: 1,
    },
    featureTitle: {
        color: COLORS.textPrimary,
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        marginBottom: 2,
    },
    featureDesc: {
        color: COLORS.textSecondary,
        fontSize: FONT_SIZES.sm,
    },
    ctaSection: {
        alignItems: 'center',
        gap: SPACING.lg,
    },
    disclaimer: {
        color: COLORS.textMuted,
        fontSize: FONT_SIZES.xs,
    },
});

export default OnboardingScreen;
