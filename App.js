import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import AppNavigator from './src/navigation/AppNavigator';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.log('App Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={ebStyles.container}>
                    <Text style={ebStyles.title}>⚠️ App Error</Text>
                    <Text style={ebStyles.message}>
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </Text>
                </View>
            );
        }
        return this.props.children;
    }
}

const ebStyles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, backgroundColor: '#1A1F1B' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#E8EDE9' },
    message: { fontSize: 14, color: '#999', textAlign: 'center', lineHeight: 20 },
});

export default function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <LanguageProvider>
                    <AuthProvider>
                        <StatusBar style="auto" />
                        <AppNavigator />
                    </AuthProvider>
                </LanguageProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}
