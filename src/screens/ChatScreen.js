import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../styles/theme';

const INITIAL_MESSAGES = [
    {
        id: '1',
        text: "Hi there! 👋 I'm your mental wellness companion. How are you feeling today?",
        sender: 'ai',
        time: '10:00 AM',
        sentiment: null,
    },
];

const AI_RESPONSES = [
    {
        text: "Thank you for sharing that with me. It's completely normal to feel that way sometimes. Would you like to talk more about what's been on your mind?",
        sentiment: 'empathetic',
    },
    {
        text: "I hear you. Remember, it's okay to not be okay. Let's try a quick breathing exercise — breathe in for 4 counts, hold for 4, breathe out for 4. 🧘",
        sentiment: 'supportive',
    },
    {
        text: "That sounds like it's been weighing on you. Have you tried journaling about these feelings? Writing things down can sometimes help us process emotions better. 📝",
        sentiment: 'helpful',
    },
    {
        text: "I'm glad you're opening up! Talking about our feelings is a sign of strength, not weakness. Would you like me to suggest some resources that might help? 💪",
        sentiment: 'encouraging',
    },
    {
        text: "It seems like you might be experiencing some stress. On a scale of 1-10, how would you rate your stress level right now? This helps me understand better. 📊",
        sentiment: 'analytical',
    },
];

const SENTIMENT_COLORS = {
    positive: COLORS.secondary,
    neutral: COLORS.info,
    negative: COLORS.accent,
    mixed: COLORS.accentWarm,
};

const analyzeSentiment = (text) => {
    const lower = text.toLowerCase();
    const negativeWords = ['sad', 'stressed', 'anxious', 'worried', 'depressed', 'tired', 'angry', 'lonely', 'hurt', 'bad', 'terrible', 'awful'];
    const positiveWords = ['happy', 'good', 'great', 'fine', 'wonderful', 'excited', 'grateful', 'thankful', 'amazing', 'better'];

    const hasNeg = negativeWords.some(w => lower.includes(w));
    const hasPos = positiveWords.some(w => lower.includes(w));

    if (hasNeg && hasPos) return 'mixed';
    if (hasNeg) return 'negative';
    if (hasPos) return 'positive';
    return 'neutral';
};

const ChatScreen = () => {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);
    const responseIndex = useRef(0);

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
        setInputText('');
        setIsTyping(true);

        setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = AI_RESPONSES[responseIndex.current % AI_RESPONSES.length];
            responseIndex.current++;

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
        }, 1500 + Math.random() * 1000);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F5EB" />

            {/* Header */}
            <LinearGradient
                colors={['#EDF5EE', '#F5F5EB']}
                style={styles.header}
            >
                <View style={styles.aiAvatar}>
                    <LinearGradient colors={COLORS.gradientPrimary} style={styles.avatarGradient}>
                        <Ionicons name="leaf" size={22} color={COLORS.white} />
                    </LinearGradient>
                    <View style={styles.onlineDot} />
                </View>
                <View>
                    <Text style={styles.headerTitle}>Emo AI</Text>
                    <Text style={styles.headerSubtitle}>
                        {isTyping ? 'Typing...' : 'Online • Ready to help'}
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
                            <View style={[styles.sentimentBadge, { backgroundColor: SENTIMENT_COLORS[msg.sentiment] + '20' }]}>
                                <View style={[styles.sentimentDot, { backgroundColor: SENTIMENT_COLORS[msg.sentiment] }]} />
                                <Text style={[styles.sentimentText, { color: SENTIMENT_COLORS[msg.sentiment] }]}>
                                    {msg.sentiment}
                                </Text>
                            </View>
                        )}
                        <LinearGradient
                            colors={
                                msg.sender === 'user'
                                    ? COLORS.gradientPrimary
                                    : [COLORS.surfaceLight, COLORS.surface]
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[
                                styles.messageBubble,
                                msg.sender === 'user' ? styles.userBubble : styles.aiBubble,
                            ]}
                        >
                            <Text style={[
                                styles.messageText,
                                msg.sender === 'ai' && { color: COLORS.textPrimary },
                            ]}>
                                {msg.text}
                            </Text>
                            <Text style={styles.messageTime}>{msg.time}</Text>
                        </LinearGradient>
                    </View>
                ))}

                {isTyping && (
                    <View style={[styles.messageBubbleWrapper, styles.aiWrapper]}>
                        <View style={styles.typingBubble}>
                            <View style={styles.typingDots}>
                                <View style={[styles.dot, styles.dot1]} />
                                <View style={[styles.dot, styles.dot2]} />
                                <View style={[styles.dot, styles.dot3]} />
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
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="How are you feeling today..."
                            placeholderTextColor={COLORS.textMuted}
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            maxLength={500}
                        />
                        <TouchableOpacity style={styles.attachBtn}>
                            <Ionicons name="mic-outline" size={22} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={sendMessage} activeOpacity={0.8}>
                        <LinearGradient
                            colors={inputText.trim() ? COLORS.gradientPrimary : [COLORS.surfaceLight, COLORS.surfaceLight]}
                            style={styles.sendBtn}
                        >
                            <Ionicons name="send" size={20} color={COLORS.white} />
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
