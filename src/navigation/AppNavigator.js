import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SHADOWS } from '../styles/theme';
import { useAuth } from '../context/AuthContext';

import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import MoodTrackerScreen from '../screens/MoodTrackerScreen';
import AssessmentScreen from '../screens/AssessmentScreen';
import ResourcesScreen from '../screens/ResourcesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import QuizScreen from '../screens/QuizScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_CONFIG = {
    Home: { icon: 'home', activeIcon: 'home' },
    Chat: { icon: 'chatbubble-outline', activeIcon: 'chatbubble' },
    Mood: { icon: 'happy-outline', activeIcon: 'happy' },
    Resources: { icon: 'library-outline', activeIcon: 'library' },
    Profile: { icon: 'person-outline', activeIcon: 'person' },
};

const TabIcon = ({ route, focused, color, size }) => {
    const config = TAB_CONFIG[route.name];
    const iconName = focused ? config.activeIcon : config.icon;

    if (focused) {
        return (
            <View style={styles.activeTabIcon}>
                <LinearGradient
                    colors={COLORS.gradientPrimary}
                    style={styles.activeTabGradient}
                >
                    <Ionicons name={iconName} size={20} color={COLORS.white} />
                </LinearGradient>
            </View>
        );
    }

    return <Ionicons name={iconName} size={22} color={color} />;
};

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => (
                    <TabIcon route={route} focused={focused} color={color} size={size} />
                ),
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textMuted,
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabLabel,
                tabBarShowLabel: true,
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Chat" component={ChatScreen} />
            <Tab.Screen name="Mood" component={MoodTrackerScreen} />
            <Tab.Screen name="Resources" component={ResourcesScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <>
                        <Stack.Screen name="MainTabs" component={MainTabs} />
                        <Stack.Screen name="Assessment" component={AssessmentScreen} />
                        <Stack.Screen name="Quiz" component={QuizScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Signup" component={SignupScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    tabBar: {
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.cardBorder,
        height: 70,
        paddingBottom: 10,
        paddingTop: 8,
        ...SHADOWS.soft,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    activeTabIcon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTabGradient: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.glow,
    },
});

export default AppNavigator;
