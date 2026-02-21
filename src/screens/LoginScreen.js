import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    StatusBar, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import GradientButton from '../components/GradientButton';
import { signIn } from '../services/authService';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

const LoginScreen = ({ navigation }) => {
    const { promptGoogleSignIn } = useGoogleAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs = {};
        if (!email.trim()) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
        if (!password) errs.password = 'Password is required';
        else if (password.length < 6) errs.password = 'Minimum 6 characters';
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
            let msg = 'Login failed. Please try again.';
            if (error.code === 'auth/user-not-found') msg = 'No account found with this email.';
            else if (error.code === 'auth/wrong-password') msg = 'Incorrect password.';
            else if (error.code === 'auth/invalid-email') msg = 'Invalid email address.';
            else if (error.code === 'auth/too-many-requests') msg = 'Too many attempts. Try again later.';
            else if (error.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
            else if (error.code === 'auth/network-request-failed') msg = 'Network error. Check your internet connection.';
            else msg = error.message || msg;
            setErrors({ general: msg });
        } finally {
            setLoading(false);
        }
    };

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

                    {/* Logo */}
                    <View style={styles.logoArea}>
                        <LinearGradient colors={COLORS.gradientPrimary} style={styles.logoIcon}>
                            <Ionicons name="leaf" size={36} color={COLORS.white} />
                        </LinearGradient>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue your wellness journey</Text>
                        {errors.general && (
                            <View style={styles.errorBanner}>
                                <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
                                <Text style={styles.errorBannerText}>{errors.general}</Text>
                            </View>
                        )}
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
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
                                    onChangeText={(t) => { setEmail(t); setErrors(e => ({ ...e, email: null })); }}
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
                                    placeholder="••••••••"
                                    placeholderTextColor={COLORS.textMuted}
                                    value={password}
                                    onChangeText={(t) => { setPassword(t); setErrors(e => ({ ...e, password: null })); }}
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

                        {/* Forgot Password */}
                        <TouchableOpacity style={styles.forgotBtn}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <GradientButton
                            title={loading ? "Signing In..." : "Sign In"}
                            onPress={handleLogin}
                            icon={!loading && <Ionicons name="log-in-outline" size={20} color={COLORS.white} />}
                            style={{ marginTop: SPACING.md, opacity: loading ? 0.7 : 1 }}
                        />
                    </View>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or continue with</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Social Login */}
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

                    {/* Switch to Signup */}
                    <View style={styles.switchRow}>
                        <Text style={styles.switchText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={styles.switchLink}>Sign Up</Text>
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
});

export default LoginScreen;
