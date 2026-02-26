import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    StatusBar, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import GradientButton from '../components/GradientButton';
import { signUp } from '../services/authService';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const SignupScreen = ({ navigation }) => {
    const { colors, shadows } = useTheme();
    const { t } = useLanguage();
    const { promptGoogleSignIn } = useGoogleAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs = {};
        if (!name.trim()) errs.name = t('nameRequired');
        if (!email.trim()) errs.email = t('emailRequired');
        else if (!/\S+@\S+\.\S+/.test(email)) errs.email = t('invalidEmail');
        if (!password) errs.password = t('passwordRequired');
        else if (password.length < 6) errs.password = t('passwordMin');
        if (password !== confirmPassword) errs.confirm = t('passwordsMismatch');
        if (!agreeTerms) errs.terms = t('agreeTermsRequired');
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSignup = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await signUp(email, password, name);
            // Auth state change in AuthContext will auto-navigate to MainTabs
        } catch (error) {
            console.log('Signup error:', error.code, error.message);
            let msg = t('signupFailed');
            if (error.code === 'auth/email-already-in-use') msg = t('emailInUse');
            else if (error.code === 'auth/weak-password') msg = t('weakPassword');
            else if (error.code === 'auth/invalid-email') msg = t('invalidEmailAuth');
            else if (error.code === 'auth/operation-not-allowed') msg = t('operationNotAllowed');
            else if (error.code === 'auth/network-request-failed') msg = t('networkError');
            else msg = error.message || msg;
            Alert.alert(t('error'), msg);
            setErrors({ general: msg });
        } finally {
            setLoading(false);
        }
    };

    const clearError = (field) => setErrors(e => ({ ...e, [field]: null }));

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.statusBar} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Back Button */}
                    <TouchableOpacity
                        style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
                    </TouchableOpacity>

                    {/* Header */}
                    <View style={styles.headerArea}>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>{t('createAccount')}</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('signUpSubtitle')}</Text>
                        {errors.general && (
                            <View style={[styles.errorBanner, { backgroundColor: colors.danger + '15' }]}>
                                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                                <Text style={[styles.errorBannerText, { color: colors.danger }]}>{errors.general}</Text>
                            </View>
                        )}
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {/* Name */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textPrimary }]}>{t('fullName')}</Text>
                            <View style={[
                                styles.inputWrap,
                                { backgroundColor: colors.surface, borderColor: colors.cardBorder },
                                errors.name && { borderColor: colors.danger + '80' }
                            ]}>
                                <Ionicons name="person-outline" size={20} color={colors.textMuted} />
                                <TextInput
                                    style={[styles.input, { color: colors.textPrimary }]}
                                    placeholder={t('namePlaceholder')}
                                    placeholderTextColor={colors.textMuted}
                                    value={name}
                                    onChangeText={(t_) => { setName(t_); clearError('name'); }}
                                    autoCapitalize="words"
                                />
                            </View>
                            {errors.name && <Text style={[styles.errorText, { color: colors.danger }]}>{errors.name}</Text>}
                        </View>

                        {/* Email */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textPrimary }]}>{t('email')}</Text>
                            <View style={[
                                styles.inputWrap,
                                { backgroundColor: colors.surface, borderColor: colors.cardBorder },
                                errors.email && { borderColor: colors.danger + '80' }
                            ]}>
                                <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
                                <TextInput
                                    style={[styles.input, { color: colors.textPrimary }]}
                                    placeholder={t('emailPlaceholder')}
                                    placeholderTextColor={colors.textMuted}
                                    value={email}
                                    onChangeText={(t_) => { setEmail(t_); clearError('email'); }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                            {errors.email && <Text style={[styles.errorText, { color: colors.danger }]}>{errors.email}</Text>}
                        </View>

                        {/* Password */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textPrimary }]}>{t('password')}</Text>
                            <View style={[
                                styles.inputWrap,
                                { backgroundColor: colors.surface, borderColor: colors.cardBorder },
                                errors.password && { borderColor: colors.danger + '80' }
                            ]}>
                                <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
                                <TextInput
                                    style={[styles.input, { color: colors.textPrimary }]}
                                    placeholder={t('passwordPlaceholder')}
                                    placeholderTextColor={colors.textMuted}
                                    value={password}
                                    onChangeText={(t_) => { setPassword(t_); clearError('password'); }}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color={colors.textMuted}
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.password && <Text style={[styles.errorText, { color: colors.danger }]}>{errors.password}</Text>}
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textPrimary }]}>{t('confirmPassword')}</Text>
                            <View style={[
                                styles.inputWrap,
                                { backgroundColor: colors.surface, borderColor: colors.cardBorder },
                                errors.confirm && { borderColor: colors.danger + '80' }
                            ]}>
                                <Ionicons name="shield-checkmark-outline" size={20} color={colors.textMuted} />
                                <TextInput
                                    style={[styles.input, { color: colors.textPrimary }]}
                                    placeholder={t('confirmPasswordPlaceholder')}
                                    placeholderTextColor={colors.textMuted}
                                    value={confirmPassword}
                                    onChangeText={(t_) => { setConfirmPassword(t_); clearError('confirm'); }}
                                    secureTextEntry={!showPassword}
                                />
                            </View>
                            {errors.confirm && <Text style={[styles.errorText, { color: colors.danger }]}>{errors.confirm}</Text>}
                        </View>

                        {/* Terms Checkbox */}
                        <TouchableOpacity
                            style={styles.termsRow}
                            onPress={() => { setAgreeTerms(!agreeTerms); clearError('terms'); }}
                            activeOpacity={0.7}
                        >
                            <View style={[
                                styles.checkbox,
                                { borderColor: colors.cardBorder },
                                agreeTerms && { backgroundColor: colors.primary, borderColor: colors.primary }
                            ]}>
                                {agreeTerms && <Ionicons name="checkmark" size={14} color={colors.white} />}
                            </View>
                            <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                                {t('agreeTerms')}
                                <Text style={[styles.termsLink, { color: colors.primary }]}>{t('termsOfService')}</Text>
                                {t('and')}
                                <Text style={[styles.termsLink, { color: colors.primary }]}>{t('privacyPolicy')}</Text>
                            </Text>
                        </TouchableOpacity>
                        {errors.terms && <Text style={[styles.errorText, { color: colors.danger }]}>{errors.terms}</Text>}

                        {/* Signup Button */}
                        <GradientButton
                            title={loading ? t('creatingAccount') : t('createAccount')}
                            onPress={handleSignup}
                            icon={!loading && <Ionicons name="person-add-outline" size={20} color={colors.white} />}
                            colors={colors.gradientSecondary}
                            style={{ marginTop: SPACING.md, opacity: loading ? 0.7 : 1 }}
                        />
                    </View>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={[styles.dividerLine, { backgroundColor: colors.cardBorder }]} />
                        <Text style={[styles.dividerText, { color: colors.textMuted }]}>{t('orSignUpWith')}</Text>
                        <View style={[styles.dividerLine, { backgroundColor: colors.cardBorder }]} />
                    </View>

                    {/* Social Signup */}
                    <View style={styles.socialRow}>
                        <TouchableOpacity style={[styles.socialBtn, { backgroundColor: colors.surface, borderColor: colors.cardBorder }, shadows.soft]} onPress={promptGoogleSignIn}>
                            <Ionicons name="logo-google" size={22} color="#EA4335" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.socialBtn, { backgroundColor: colors.surface, borderColor: colors.cardBorder }, shadows.soft]} onPress={() => Alert.alert(t('comingSoon'), 'Apple sign-in will be available in a future update.')}>
                            <Ionicons name="logo-apple" size={22} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.socialBtn, { backgroundColor: colors.surface, borderColor: colors.cardBorder }, shadows.soft]} onPress={() => Alert.alert(t('comingSoon'), 'Facebook sign-in will be available in a future update.')}>
                            <Ionicons name="logo-facebook" size={22} color="#1877F2" />
                        </TouchableOpacity>
                    </View>

                    {/* Switch to Login */}
                    <View style={styles.switchRow}>
                        <Text style={[styles.switchText, { color: colors.textSecondary }]}>{t('alreadyHaveAccount')}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={[styles.switchLink, { color: colors.primary }]}>{t('login')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scroll: {
        padding: SPACING.xl,
        paddingTop: SPACING.xxxl + 10,
    },
    backBtn: {
        width: 42,
        height: 42,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        marginBottom: SPACING.xl,
    },
    headerArea: {
        marginBottom: SPACING.xxl,
    },
    title: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.danger + '15',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginTop: SPACING.lg,
        gap: SPACING.sm,
    },
    errorBannerText: {
        flex: 1,
        fontSize: FONT_SIZES.sm,
        color: COLORS.danger,
        fontWeight: '600',
    },
    form: {
        gap: SPACING.lg,
    },
    inputGroup: {
        gap: SPACING.sm,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginLeft: SPACING.xs,
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        gap: SPACING.md,
    },
    input: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
    },
    errorText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.danger,
        marginLeft: SPACING.xs,
    },
    termsRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: SPACING.md,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: COLORS.cardBorder,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 1,
    },
    termsText: {
        flex: 1,
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
    termsLink: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.xxl,
        gap: SPACING.md,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.cardBorder,
    },
    dividerText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textMuted,
        fontWeight: '600',
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.lg,
        marginBottom: SPACING.xxl,
    },
    socialBtn: {
        width: 56,
        height: 56,
        borderRadius: BORDER_RADIUS.lg,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        ...SHADOWS.soft,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: SPACING.xxl,
    },
    switchText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
    },
    switchLink: {
        fontSize: FONT_SIZES.md,
        color: COLORS.primary,
        fontWeight: '700',
    },
});

export default SignupScreen;
