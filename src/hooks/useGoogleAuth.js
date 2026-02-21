import { useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { firebaseGoogleSignIn } from '../services/authService';

WebBrowser.maybeCompleteAuthSession();

// ⚠️ Replace with your Web client ID from Firebase Console
// Go to: Firebase Console → Authentication → Sign-in method → Google → Web SDK configuration
const WEB_CLIENT_ID = '189851160007-gf4befcp9mrjb046cc87oi7slsk0v724.apps.googleusercontent.com';

/**
 * Custom hook for Google Sign-In with Expo + Firebase.
 * Returns { promptGoogleSignIn, isLoading }
 */
export const useGoogleAuth = () => {
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: WEB_CLIENT_ID,
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            firebaseGoogleSignIn(id_token).catch((error) => {
                console.log('Google Sign-In Firebase error:', error.message);
            });
        }
    }, [response]);

    const promptGoogleSignIn = async () => {
        if (!request) {
            console.log('Google Auth request not ready yet');
            return;
        }
        await promptAsync();
    };

    return {
        promptGoogleSignIn,
        isLoading: !request,
    };
};
