import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserProfile } from './dbService';

/**
 * Sign up a new user with email/password and create their Firestore profile.
 */
export const signUp = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set display name on Firebase Auth
    await updateProfile(user, { displayName: name });

    // Create user profile in Firestore
    await createUserProfile(user.uid, {
        name,
        email,
        createdAt: new Date().toISOString(),
        avatar: null,
    });

    return user;
};

/**
 * Sign in an existing user with email/password.
 */
export const signIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

/**
 * Sign out the current user.
 */
export const signOutUser = async () => {
    await firebaseSignOut(auth);
};

/**
 * Listen to auth state changes.
 * Returns an unsubscribe function.
 */
export const onAuthStateChanged = (callback) => {
    return firebaseOnAuthStateChanged(auth, callback);
};
