import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    StatusBar, KeyboardAvoidingView, Platform, ScrollView, Alert, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import GradientButton from '../components/GradientButton';
import { signIn, resetPassword } from '../services/authService';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const LoginScreen = ({ navigation }) => {
    const { colors, shadows } = useTheme();
    const { t } = useLanguage();
    const { promptGoogleSignIn } = useGoogleAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [resetModalVisible, setResetModalVisible] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);

    const validate = () => {
        const errs = {};
        if (!email.trim()) errs.email = t('emailRequired');
        else if (!/\S+@\S+\.\S+/.test(email)) errs.email = t('invalidEmail');
        if (!password) errs.password = t('passwordRequired');
        else if (password.length < 6) errs.password = t('passwordMin');
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await signIn(email, password);
            // Auth state change in AuthContext will auto-navigate to MainTabs
        } catch (error) {
            console.log('Login error:', error.code, error.message);
            let msg = t('loginFailed');
            if (error.code === 'auth/user-not-found') msg = t('userNotFound');
            else if (error.code === 'auth/wrong-password') msg = t('wrongPassword');
            else if (error.code === 'auth/invalid-email') msg = t('invalidEmailAuth');
            else if (error.code === 'auth/too-many-requests') msg = t('tooManyRequests');
            else if (error.code === 'auth/invalid-credential') msg = t('invalidCredential');
            else if (error.code === 'auth/network-request-failed') msg = t('networkError');
            else msg = error.message || msg;
            setErrors({ general: msg });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!resetEmail.trim() || !/\S+@\S+\.\S+/.test(resetEmail)) {
            Alert.alert(t('error'), t('invalidEmail'));
            return;
        }
        setResetLoading(true);
        try {
            await resetPassword(resetEmail);
            Alert.alert(t('success'), t('resetEmailSent'));
            setResetModalVisible(false);
            setResetEmail('');
        } catch (error) {
            let msg = t('loginFailed');
            if (error.code === 'auth/user-not-found') msg = t('userNotFound');
            else if (error.code === 'auth/invalid-email') msg = t('invalidEmailAuth');
            Alert.alert(t('error'), msg);
        } finally {
            setResetLoading(false);
        }
    };

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

                    {/* Logo */}
                    <View style={styles.logoArea}>
                        <LinearGradient colors={colors.gradientPrimary} style={[styles.logoIcon, shadows.glow]}>
                            <Ionicons name="leaf" size={36} color={colors.white} />
                        </LinearGradient>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>{t('welcomeBack')}</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t('signInSubtitle')}</Text>
                        {errors.general && (
                            <View style={[styles.errorBanner, { backgroundColor: colors.danger + '15' }]}>
                                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                                <Text style={[styles.errorBannerText, { color: colors.danger }]}>{errors.general}</Text>
                            </View>
                        )}
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
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
                                    onChangeText={(t_) => { setEmail(t_); setErrors(e => ({ ...e, email: null })); }}
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
                                    placeholder="••••••••"
                                    placeholderTextColor={colors.textMuted}
                                    value={password}
                                    onChangeText={(t_) => { setPassword(t_); setErrors(e => ({ ...e, password: null })); }}
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

                        {/* Forgot Password */}
                        <TouchableOpacity style={styles.forgotBtn} onPress={() => { setResetEmail(email); setResetModalVisible(true); }}>
                            <Text style={[styles.forgotText, { color: colors.primary }]}>{t('forgotPassword')}</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <GradientButton
                            title={loading ? t('signingIn') : t('login')}
                            onPress={handleLogin}
                            icon={!loading && <Ionicons name="log-in-outline" size={20} color={colors.white} />}
                            style={{ marginTop: SPACING.md, opacity: loading ? 0.7 : 1 }}
                        />
                    </View>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={[styles.dividerLine, { backgroundColor: colors.cardBorder }]} />
                        <Text style={[styles.dividerText, { color: colors.textMuted }]}>{t('orContinueWith')}</Text>
                        <View style={[styles.dividerLine, { backgroundColor: colors.cardBorder }]} />
                    </View>

                    {/* Social Login */}
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

                    {/* Switch to Signup */}
                    <View style={styles.switchRow}>
                        <Text style={[styles.switchText, { color: colors.textSecondary }]}>{t('dontHaveAccount')}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={[styles.switchLink, { color: colors.primary }]}>{t('signup')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Password Reset Modal */}
            <Modal
                visible={resetModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setResetModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{t('resetPassword')}</Text>
                        <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>{t('resetPasswordMsg')}</Text>
                        <View style={[styles.inputWrap, { backgroundColor: colors.surfaceLight, borderColor: colors.cardBorder, marginTop: SPACING.lg }]}>
                            <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
                            <TextInput
                                style={[styles.input, { color: colors.textPrimary }]}
                                placeholder={t('emailPlaceholder')}
                                placeholderTextColor={colors.textMuted}
                                value={resetEmail}
                                onChangeText={setResetEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalCancelBtn, { borderColor: colors.cardBorder }]}
                                onPress={() => setResetModalVisible(false)}
                            >
                                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>{t('cancel')}</Text>
                            </TouchableOpacity>
                            <GradientButton
                                title={resetLoading ? '...' : t('sendResetLink')}
                                onPress={handleResetPassword}
                                small
                                style={{ flex: 1, opacity: resetLoading ? 0.7 : 1 }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
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
        marginBottom: SPACING.xxl,
    },
    logoArea: {
        alignItems: 'center',
        marginBottom: SPACING.xxxl,
    },
    logoIcon: {
        width: 72,
        height: 72,
        borderRadius: BORDER_RADIUS.xxl,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.lg,
        ...SHADOWS.glow,
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
    forgotBtn: {
        alignSelf: 'flex-end',
    },
    forgotText: {
        fontSize: FONT_SIZES.sm,
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
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    modalContent: {
        width: '100%',
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xxl,
    },
    modalTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '800',
        marginBottom: SPACING.sm,
    },
    modalDesc: {
        fontSize: FONT_SIZES.sm,
        lineHeight: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginTop: SPACING.xl,
    },
    modalCancelBtn: {
        flex: 1,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCancelText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
    },
});

export default LoginScreen;
