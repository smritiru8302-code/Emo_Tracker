import {
    doc, setDoc, getDoc, collection, addDoc,
    query, orderBy, limit, getDocs, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── USER PROFILES ───────────────────────────────────

/**
 * Create a user profile document in Firestore.
 */
export const createUserProfile = async (uid, data) => {
    await setDoc(doc(db, 'users', uid), {
        ...data,
        createdAt: serverTimestamp(),
    });
};

/**
 * Get the current user's profile.
 */
export const getUserProfile = async (uid) => {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    return null;
};

// ─── MOOD ENTRIES ────────────────────────────────────

/**
 * Save a mood entry for the user.
 */
export const saveMoodEntry = async (uid, moodData) => {
    const ref = collection(db, 'users', uid, 'moods');
    await addDoc(ref, {
        ...moodData,
        timestamp: serverTimestamp(),
    });
};

/**
 * Get the user's mood history (latest 30).
 */
export const getMoodHistory = async (uid) => {
    const ref = collection(db, 'users', uid, 'moods');
    const q = query(ref, orderBy('timestamp', 'desc'), limit(30));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ─── QUIZ RESULTS ────────────────────────────────────

/**
 * Save a quiz result for the user.
 */
export const saveQuizResult = async (uid, resultData) => {
    const ref = collection(db, 'users', uid, 'quizResults');
    await addDoc(ref, {
        ...resultData,
        timestamp: serverTimestamp(),
    });
};

/**
 * Get the user's quiz result history (latest 10).
 */
export const getQuizHistory = async (uid) => {
    const ref = collection(db, 'users', uid, 'quizResults');
    const q = query(ref, orderBy('timestamp', 'desc'), limit(10));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
