import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    signInWithCredential,
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserProfile, getUserProfile } from './dbService';

/**
 * Sign up a new user with email/password and create their Firestore profile.
 */
export const signUp = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

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
 * Sign in with Google using an ID token from expo-auth-session.
 * Creates a Firestore profile if it's the user's first time.
 */
export const firebaseGoogleSignIn = async (idToken) => {
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    // Check if this user already has a profile; if not, create one
    const existingProfile = await getUserProfile(user.uid);
    if (!existingProfile) {
        await createUserProfile(user.uid, {
            name: user.displayName || 'User',
            email: user.email,
            createdAt: new Date().toISOString(),
            avatar: user.photoURL || null,
        });
    }

    return user;
};

/**
 * Sign out the current user.
 */
export const signOutUser = async () => {
    await firebaseSignOut(auth);
};

/**
 * Listen to auth state changes.
 */
export const onAuthStateChanged = (callback) => {
    return firebaseOnAuthStateChanged(auth, callback);
};
