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

const SignupScreen = ({ navigation }) => {
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
        if (!name.trim()) errs.name = 'Name is required';
        if (!email.trim()) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
        if (!password) errs.password = 'Password is required';
        else if (password.length < 6) errs.password = 'Minimum 6 characters';
        if (password !== confirmPassword) errs.confirm = 'Passwords do not match';
        if (!agreeTerms) errs.terms = 'You must agree to the terms';
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
            let msg = 'Signup failed. Please try again.';
            if (error.code === 'auth/email-already-in-use') msg = 'An account with this email already exists.';
            else if (error.code === 'auth/weak-password') msg = 'Password is too weak.';
            else if (error.code === 'auth/invalid-email') msg = 'Invalid email address.';
            else if (error.code === 'auth/operation-not-allowed') msg = 'Email/Password sign-in is not enabled in Firebase Console.';
            else if (error.code === 'auth/network-request-failed') msg = 'Network error. Check your internet connection.';
            else msg = error.message || msg;
            Alert.alert('Signup Error', msg);
            setErrors({ general: msg });
        } finally {
            setLoading(false);
        }
    };

    const clearError = (field) => setErrors(e => ({ ...e, [field]: null }));

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F5EB" />
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
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
                    </TouchableOpacity>

                    {/* Header */}
                    <View style={styles.headerArea}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Start your mental wellness journey today</Text>
                        {errors.general && (
                            <View style={styles.errorBanner}>
                                <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
                                <Text style={styles.errorBannerText}>{errors.general}</Text>
                            </View>
                        )}
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {/* Name */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={[styles.inputWrap, errors.name && styles.inputError]}>
                                <Ionicons name="person-outline" size={20} color={COLORS.textMuted} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="John Doe"
                                    placeholderTextColor={COLORS.textMuted}
                                    value={name}
                                    onChangeText={(t) => { setName(t); clearError('name'); }}
                                    autoCapitalize="words"
                                />
                            </View>
                            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                        </View>

                        {/* Email */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={[styles.inputWrap, errors.email && styles.inputError]}>
                                <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="you@example.com"
                                    placeholderTextColor={COLORS.textMuted}
                                    value={email}
                                    onChangeText={(t) => { setEmail(t); clearError('email'); }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                        </View>

                        {/* Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={[styles.inputWrap, errors.password && styles.inputError]}>
                                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Minimum 6 characters"
                                    placeholderTextColor={COLORS.textMuted}
                                    value={password}
                                    onChangeText={(t) => { setPassword(t); clearError('password'); }}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color={COLORS.textMuted}
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={[styles.inputWrap, errors.confirm && styles.inputError]}>
                                <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.textMuted} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Re-enter password"
                                    placeholderTextColor={COLORS.textMuted}
                                    value={confirmPassword}
                                    onChangeText={(t) => { setConfirmPassword(t); clearError('confirm'); }}
                                    secureTextEntry={!showPassword}
                                />
                            </View>
                            {errors.confirm && <Text style={styles.errorText}>{errors.confirm}</Text>}
                        </View>

                        {/* Terms Checkbox */}
                        <TouchableOpacity
                            style={styles.termsRow}
                            onPress={() => { setAgreeTerms(!agreeTerms); clearError('terms'); }}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                                {agreeTerms && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
                            </View>
                            <Text style={styles.termsText}>
                                I agree to the{' '}
                                <Text style={styles.termsLink}>Terms of Service</Text>
                                {' '}and{' '}
                                <Text style={styles.termsLink}>Privacy Policy</Text>
                            </Text>
                        </TouchableOpacity>
                        {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

                        {/* Signup Button */}
                        <GradientButton
                            title={loading ? "Creating Account..." : "Create Account"}
                            onPress={handleSignup}
                            icon={!loading && <Ionicons name="person-add-outline" size={20} color={COLORS.white} />}
                            colors={COLORS.gradientSecondary}
                            style={{ marginTop: SPACING.md, opacity: loading ? 0.7 : 1 }}
                        />
                    </View>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or sign up with</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Social Signup */}
                    <View style={styles.socialRow}>
                        <TouchableOpacity style={styles.socialBtn} onPress={promptGoogleSignIn}>
                            <Ionicons name="logo-google" size={22} color="#EA4335" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialBtn} onPress={() => Alert.alert('Coming Soon', 'Apple sign-in will be available in a future update.')}>
                            <Ionicons name="logo-apple" size={22} color={COLORS.textPrimary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialBtn} onPress={() => Alert.alert('Coming Soon', 'Facebook sign-in will be available in a future update.')}>
                            <Ionicons name="logo-facebook" size={22} color="#1877F2" />
                        </TouchableOpacity>
                    </View>

                    {/* Switch to Login */}
                    <View style={styles.switchRow}>
                        <Text style={styles.switchText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.switchLink}>Sign In</Text>
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
    inputError: {
        borderColor: COLORS.danger + '80',
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
    checkboxChecked: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
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
