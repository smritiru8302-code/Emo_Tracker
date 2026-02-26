import React from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';
import GradientButton from '../components/GradientButton';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
    const { colors } = useTheme();

    return (
        <LinearGradient
            colors={colors.gradientDark}
            style={styles.container}
        >
            <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.statusBar} />

            {/* Decorative leaf-like circles */}
            <View style={[styles.circle1, { backgroundColor: colors.primary + '10' }]} />
            <View style={[styles.circle2, { backgroundColor: colors.secondary + '10' }]} />
            <View style={[styles.circle3, { backgroundColor: colors.accent + '08' }]} />

            {/* Logo Area */}
            <View style={styles.logoSection}>
                <View style={styles.logoContainer}>
                    <LinearGradient
                        colors={colors.gradientPrimary}
                        style={styles.logoGradient}
                    >
                        <Ionicons name="leaf" size={48} color={colors.white} />
                    </LinearGradient>
                </View>
                <Text style={[styles.appName, { color: colors.textPrimary }]}>Emo Tracker</Text>
                <Text style={[styles.tagline, { color: colors.textSecondary }]}>Your Wellness Companion 🌿</Text>
            </View>

            {/* Feature Highlights */}
            <View style={styles.featuresSection}>
                <FeatureItem icon="chatbubble-ellipses" color={colors.primary} title="AI Conversations" description="Talk to our empathetic AI chatbot anytime" colors={colors} />
                <FeatureItem icon="analytics" color={colors.accent} title="Mood Tracking" description="Monitor your emotional well-being daily" colors={colors} />
                <FeatureItem icon="shield-checkmark" color={colors.info} title="Early Detection" description="Identify stress patterns early on" colors={colors} />
            </View>

            {/* CTA */}
            <View style={styles.ctaSection}>
                <GradientButton
                    title="Get Started"
                    onPress={() => navigation.replace('Login')}
                    icon={<Ionicons name="arrow-forward" size={20} color={colors.white} />}
                />
                <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
                    🔒 Your data is encrypted and private
                </Text>
            </View>
        </LinearGradient>
    );
};

const FeatureItem = ({ icon, color, title, description, colors }) => (
    <View style={[styles.featureItem, { backgroundColor: colors.surface + '90', borderColor: colors.cardBorder }]}>
        <View style={[styles.featureIcon, { backgroundColor: color + '15' }]}>
            <Ionicons name={icon} size={22} color={color} />
        </View>
        <View style={styles.featureText}>
            <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>{title}</Text>
            <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>{description}</Text>
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
    circle1: { position: 'absolute', width: 300, height: 300, borderRadius: 150, top: -80, right: -100 },
    circle2: { position: 'absolute', width: 200, height: 200, borderRadius: 100, bottom: 100, left: -60 },
    circle3: { position: 'absolute', width: 150, height: 150, borderRadius: 75, top: height * 0.4, right: -40 },
    logoSection: { alignItems: 'center', gap: SPACING.md },
    logoContainer: { marginBottom: SPACING.md },
    logoGradient: { width: 90, height: 90, borderRadius: BORDER_RADIUS.xxl, justifyContent: 'center', alignItems: 'center' },
    appName: { fontSize: FONT_SIZES.hero, fontWeight: '800', letterSpacing: 1 },
    tagline: { fontSize: FONT_SIZES.lg, fontWeight: '400' },
    featuresSection: { gap: SPACING.xl },
    featureItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.lg, padding: SPACING.lg, borderRadius: BORDER_RADIUS.xl, borderWidth: 1 },
    featureIcon: { width: 48, height: 48, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
    featureText: { flex: 1 },
    featureTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', marginBottom: 2 },
    featureDesc: { fontSize: FONT_SIZES.sm },
    ctaSection: { alignItems: 'center', gap: SPACING.lg },
    disclaimer: { fontSize: FONT_SIZES.xs },
});

export default OnboardingScreen;
