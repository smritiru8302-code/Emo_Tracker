import { useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { firebaseGoogleSignIn } from '../services/authService';
import { GOOGLE_WEB_CLIENT_ID } from '@env';

WebBrowser.maybeCompleteAuthSession();

/**
 * Custom hook for Google Sign-In with Expo + Firebase.
 * Returns { promptGoogleSignIn, isLoading }
 */
export const useGoogleAuth = () => {
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: GOOGLE_WEB_CLIENT_ID,
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
