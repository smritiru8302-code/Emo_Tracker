import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { saveChatSession } from '../services/dbService';

const getSentimentColors = (colors) => ({
    positive: colors.secondary,
    neutral: colors.info,
    negative: colors.accent,
    mixed: colors.accentWarm,
});

const analyzeSentiment = (text) => {
    const lower = text.toLowerCase();
    const negativeWords = ['sad', 'stressed', 'anxious', 'worried', 'depressed', 'tired', 'angry', 'lonely', 'hurt', 'bad', 'terrible', 'awful', 'overwhelmed', 'hopeless', 'scared', 'frustrated', 'panic', 'cry'];
    const positiveWords = ['happy', 'good', 'great', 'fine', 'wonderful', 'excited', 'grateful', 'thankful', 'amazing', 'better', 'love', 'joy', 'peaceful', 'calm', 'confident', 'proud', 'smile'];

    const hasNeg = negativeWords.some(w => lower.includes(w));
    const hasPos = positiveWords.some(w => lower.includes(w));

    if (hasNeg && hasPos) return 'mixed';
    if (hasNeg) return 'negative';
    if (hasPos) return 'positive';
    return 'neutral';
};

// Contextual AI response selection based on sentiment and keywords
const getContextualResponse = (text, sentiment) => {
    const lower = text.toLowerCase();

    // Urgent/crisis keywords
    if (lower.includes('suicide') || lower.includes('self-harm') || lower.includes('end it') || lower.includes('give up')) {
        return {
            text: "I hear you, and I want you to know that you matter. If you're having thoughts of self-harm, please reach out to the National Crisis Helpline at 988 (US) or your local emergency number. You don't have to face this alone. ❤️",
            sentiment: 'crisis',
        };
    }

    // Anxiety-specific
    if (lower.includes('anxious') || lower.includes('anxiety') || lower.includes('panic') || lower.includes('worried')) {
        return {
            text: "Anxiety can feel overwhelming, but it's your body trying to protect you. Let's try grounding: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. This helps bring you back to the present. 🧘",
            sentiment: 'supportive',
        };
    }

    // Stress-specific
    if (lower.includes('stressed') || lower.includes('stress') || lower.includes('overwhelmed') || lower.includes('pressure')) {
        return {
            text: "Stress can build up when we carry too much. Try breaking your tasks into smaller pieces. Also, a 5-minute deep breathing exercise can really help lower your cortisol levels. Would you like me to guide you through one? 🌿",
            sentiment: 'helpful',
        };
    }

    // Sleep issues
    if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes('cant sleep') || lower.includes('tired')) {
        return {
            text: "Sleep is crucial for mental health. Try limiting screen time 1 hour before bed, keep your room cool and dark, and consider a short meditation or body scan before sleep. Consistent bedtime routines can really help. 🌙",
            sentiment: 'helpful',
        };
    }

    // Loneliness
    if (lower.includes('lonely') || lower.includes('alone') || lower.includes('isolated') || lower.includes('no friends')) {
        return {
            text: "Feeling lonely is more common than you think, and it's okay to acknowledge it. Small steps matter — try reaching out to someone you trust, joining a local group, or even volunteering. Connection starts with one conversation. 💬",
            sentiment: 'empathetic',
        };
    }

    // Sadness/depression
    if (lower.includes('sad') || lower.includes('depressed') || lower.includes('hopeless') || lower.includes('cry')) {
        return {
            text: "I'm sorry you're feeling this way. Sadness is a valid emotion, and it's okay to sit with it. Try to be gentle with yourself today. Small acts of self-care — a warm drink, a walk outside, or talking to someone you trust — can make a big difference. 🌷",
            sentiment: 'empathetic',
        };
    }

    // Positive sentiment
    if (sentiment === 'positive') {
        return {
            text: "That's wonderful to hear! 🎉 Celebrating positive moments — even small ones — is important for your wellbeing. What made today good? Recognizing these patterns helps build resilience for tougher days.",
            sentiment: 'encouraging',
        };
    }

    // General/neutral fallback responses
    const neutralResponses = [
        { text: "Thank you for sharing that with me. It's important to check in with yourself regularly. Would you like to tell me more about how your day has been?", sentiment: 'empathetic' },
        { text: "I appreciate you opening up. Remember, every conversation we have helps build self-awareness. What's been on your mind the most today? 💭", sentiment: 'supportive' },
        { text: "I'm here to listen. Sometimes just putting feelings into words can bring clarity. Is there anything specific you'd like to explore or work through together?", sentiment: 'helpful' },
        { text: "That's a great observation. Self-reflection is a powerful tool for mental wellness. Would you like me to suggest some journaling prompts based on what you've shared? 📝", sentiment: 'encouraging' },
    ];

    return neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
};

const ChatScreen = () => {
    const { colors, shadows, isDark } = useTheme();
    const { t } = useLanguage();
    const { user } = useAuth();
    const sentimentColors = getSentimentColors(colors);
    const [messages, setMessages] = useState([
        {
            id: '1',
            text: t('aiGreeting'),
            sender: 'ai',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sentiment: null,
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);
    const sessionStartRef = useRef(new Date());

    // Auto-save chat session when user navigates away or after inactivity
    useEffect(() => {
        return () => {
            // Save on unmount if there are user messages
            if (user && messages.length > 1) {
                saveChatSession(user.uid, {
                    messages: messages.map(m => ({
                        text: m.text,
                        sender: m.sender,
                        sentiment: m.sentiment,
                        time: m.time,
                    })),
                    sessionStart: sessionStartRef.current.toISOString(),
                    messageCount: messages.length,
                }).catch(err => console.log('Error saving chat session:', err));
            }
        };
    }, [messages, user]);

    const sendMessage = () => {
        if (!inputText.trim()) return;

        const sentiment = analyzeSentiment(inputText);
        const userMsg = {
            id: Date.now().toString(),
            text: inputText.trim(),
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sentiment,
        };

        setMessages(prev => [...prev, userMsg]);
        const userText = inputText.trim();
        setInputText('');
        setIsTyping(true);

        setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Get contextual AI response
        setTimeout(() => {
            const aiResponse = getContextualResponse(userText, sentiment);

            const aiMsg = {
                id: (Date.now() + 1).toString(),
                text: aiResponse.text,
                sender: 'ai',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sentiment: null,
            };

            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);

            setTimeout(() => {
                scrollRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }, 1200 + Math.random() * 800);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.statusBar} />

            {/* Header */}
            <LinearGradient
                colors={colors.gradientDark}
                style={[styles.header, { borderBottomColor: colors.cardBorder }]}
            >
                <View style={styles.aiAvatar}>
                    <LinearGradient colors={colors.gradientPrimary} style={styles.avatarGradient}>
                        <Ionicons name="leaf" size={22} color={colors.white} />
                    </LinearGradient>
                    <View style={[styles.onlineDot, { backgroundColor: colors.secondary, borderColor: colors.background }]} />
                </View>
                <View>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{t('emoAi')}</Text>
                    <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                        {isTyping ? t('typing') : t('onlineReady')}
                    </Text>
                </View>
            </LinearGradient>

            {/* Messages */}
            <ScrollView
                ref={scrollRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
            >
                {messages.map((msg) => (
                    <View
                        key={msg.id}
                        style={[
                            styles.messageBubbleWrapper,
                            msg.sender === 'user' ? styles.userWrapper : styles.aiWrapper,
                        ]}
                    >
                        {msg.sentiment && msg.sender === 'user' && (
                            <View style={[styles.sentimentBadge, { backgroundColor: sentimentColors[msg.sentiment] + '20' }]}>
                                <View style={[styles.sentimentDot, { backgroundColor: sentimentColors[msg.sentiment] }]} />
                                <Text style={[styles.sentimentText, { color: sentimentColors[msg.sentiment] }]}>
                                    {msg.sentiment}
                                </Text>
                            </View>
                        )}
                        <LinearGradient
                            colors={
                                msg.sender === 'user'
                                    ? colors.gradientPrimary
                                    : [colors.surfaceLight, colors.surface]
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[
                                styles.messageBubble,
                                msg.sender === 'user' ? styles.userBubble : [styles.aiBubble, { borderColor: colors.cardBorder }],
                            ]}
                        >
                            <Text style={[
                                styles.messageText,
                                { color: msg.sender === 'user' ? colors.white : colors.textPrimary },
                            ]}>
                                {msg.text}
                            </Text>
                            <Text style={[styles.messageTime, { color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(26,26,46,0.4)' }]}>{msg.time}</Text>
                        </LinearGradient>
                    </View>
                ))}

                {isTyping && (
                    <View style={[styles.messageBubbleWrapper, styles.aiWrapper]}>
                        <View style={[styles.typingBubble, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
                            <View style={styles.typingDots}>
                                <View style={[styles.dot, styles.dot1, { backgroundColor: colors.textMuted }]} />
                                <View style={[styles.dot, styles.dot2, { backgroundColor: colors.textMuted }]} />
                                <View style={[styles.dot, styles.dot3, { backgroundColor: colors.textMuted }]} />
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={90}
            >
                <View style={[styles.inputContainer, { borderTopColor: colors.cardBorder, backgroundColor: colors.surface + '80' }]}>
                    <View style={[styles.inputWrapper, { backgroundColor: colors.surfaceLight, borderColor: colors.cardBorder }]}>
                        <TextInput
                            style={[styles.input, { color: colors.textPrimary }]}
                            placeholder={t('chatPlaceholder')}
                            placeholderTextColor={colors.textMuted}
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            maxLength={500}
                        />
                        <TouchableOpacity style={styles.attachBtn}>
                            <Ionicons name="mic-outline" size={22} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={sendMessage} activeOpacity={0.8}>
                        <LinearGradient
                            colors={inputText.trim() ? colors.gradientPrimary : [colors.surfaceLight, colors.surfaceLight]}
                            style={styles.sendBtn}
                        >
                            <Ionicons name="send" size={20} color={colors.white} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: SPACING.lg,
        paddingHorizontal: SPACING.xl,
        gap: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.cardBorder,
    },
    aiAvatar: {
        position: 'relative',
    },
    avatarGradient: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    onlineDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.secondary,
        borderWidth: 2,
        borderColor: COLORS.background,
    },
    headerTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    headerSubtitle: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: SPACING.lg,
        gap: SPACING.md,
    },
    messageBubbleWrapper: {
        maxWidth: '82%',
        gap: SPACING.xs,
    },
    userWrapper: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    aiWrapper: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    sentimentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 3,
        borderRadius: BORDER_RADIUS.full,
        gap: 4,
    },
    sentimentDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    sentimentText: {
        fontSize: 9,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    messageBubble: {
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.xl,
        ...SHADOWS.soft,
    },
    userBubble: {
        borderBottomRightRadius: SPACING.xs,
    },
    aiBubble: {
        borderBottomLeftRadius: SPACING.xs,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    messageText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.white,
        lineHeight: 20,
    },
    messageTime: {
        fontSize: 10,
        color: 'rgba(26,26,46,0.4)',
        marginTop: SPACING.sm,
        textAlign: 'right',
    },
    typingBubble: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.xl,
        borderBottomLeftRadius: SPACING.xs,
        padding: SPACING.lg,
        paddingHorizontal: SPACING.xxl,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    typingDots: {
        flexDirection: 'row',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.textMuted,
    },
    dot1: { opacity: 0.4 },
    dot2: { opacity: 0.6 },
    dot3: { opacity: 0.8 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: SPACING.lg,
        paddingBottom: SPACING.xxl,
        gap: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.cardBorder,
        backgroundColor: COLORS.surface + '80',
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: COLORS.surfaceLight,
        borderRadius: BORDER_RADIUS.xl,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
    },
    input: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: FONT_SIZES.md,
        maxHeight: 80,
        paddingVertical: SPACING.sm,
    },
    attachBtn: {
        padding: SPACING.sm,
    },
    sendBtn: {
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatScreen;
