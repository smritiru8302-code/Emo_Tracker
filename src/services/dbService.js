import {
    doc, setDoc, getDoc, updateDoc, collection, addDoc,
    query, orderBy, limit, getDocs, serverTimestamp, where,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── USER PROFILES ───────────────────────────────────

export const createUserProfile = async (uid, data) => {
    await setDoc(doc(db, 'users', uid), {
        ...data,
        createdAt: serverTimestamp(),
    });
};

export const getUserProfile = async (uid) => {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    return null;
};

export const updateUserProfile = async (uid, data) => {
    await updateDoc(doc(db, 'users', uid), {
        ...data,
        updatedAt: serverTimestamp(),
    });
};

// ─── MOOD ENTRIES ────────────────────────────────────

export const saveMoodEntry = async (uid, moodData) => {
    const ref = collection(db, 'users', uid, 'moods');
    await addDoc(ref, {
        ...moodData,
        timestamp: serverTimestamp(),
    });
};

export const getMoodHistory = async (uid, max = 30) => {
    const ref = collection(db, 'users', uid, 'moods');
    const q = query(ref, orderBy('timestamp', 'desc'), limit(max));
    const snap = await getDocs(q);
    return snap.docs.map(d => {
        const data = d.data();
        return {
            id: d.id,
            ...data,
            // Convert Firestore timestamp to JS Date for display
            timestamp: data.timestamp?.toDate?.() || new Date(),
        };
    });
};

// ─── QUIZ RESULTS ────────────────────────────────────

export const saveQuizResult = async (uid, resultData) => {
    const ref = collection(db, 'users', uid, 'quizResults');
    await addDoc(ref, {
        ...resultData,
        timestamp: serverTimestamp(),
    });
};

export const getLatestQuizResult = async (uid) => {
    const ref = collection(db, 'users', uid, 'quizResults');
    const q = query(ref, orderBy('timestamp', 'desc'), limit(1));
    const snap = await getDocs(q);
<<<<<<< Updated upstream

    if (!snap.empty) {
        const doc = snap.docs[0];
        return { id: doc.id, ...doc.data() };
    }

    return null;
=======
    return snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        timestamp: d.data().timestamp?.toDate?.() || new Date(),
    }));
};

// ─── ASSESSMENT RESULTS ──────────────────────────────

export const saveAssessmentResult = async (uid, resultData) => {
    const ref = collection(db, 'users', uid, 'assessments');
    await addDoc(ref, {
        ...resultData,
        timestamp: serverTimestamp(),
    });
};

export const getAssessmentHistory = async (uid) => {
    const ref = collection(db, 'users', uid, 'assessments');
    const q = query(ref, orderBy('timestamp', 'desc'), limit(10));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        timestamp: d.data().timestamp?.toDate?.() || new Date(),
    }));
};

// ─── CHAT SESSIONS ───────────────────────────────────

export const saveChatSession = async (uid, messages) => {
    const ref = collection(db, 'users', uid, 'chatSessions');
    await addDoc(ref, {
        messages,
        messageCount: messages.length,
        timestamp: serverTimestamp(),
    });
};

export const getChatHistory = async (uid) => {
    const ref = collection(db, 'users', uid, 'chatSessions');
    const q = query(ref, orderBy('timestamp', 'desc'), limit(10));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        timestamp: d.data().timestamp?.toDate?.() || new Date(),
    }));
};

// ─── STATS HELPERS ───────────────────────────────────

export const getUserStats = async (uid) => {
    // Mood entries count
    const moodRef = collection(db, 'users', uid, 'moods');
    const moodQuery = query(moodRef, orderBy('timestamp', 'desc'));
    const moodSnap = await getDocs(moodQuery);
    const moods = moodSnap.docs.map(d => ({
        ...d.data(),
        timestamp: d.data().timestamp?.toDate?.() || new Date(),
    }));

    // Quiz count
    const quizRef = collection(db, 'users', uid, 'quizResults');
    const quizSnap = await getDocs(quizRef);

    // Assessment count
    const assessRef = collection(db, 'users', uid, 'assessments');
    const assessSnap = await getDocs(assessRef);

    // Chat count
    const chatRef = collection(db, 'users', uid, 'chatSessions');
    const chatSnap = await getDocs(chatRef);

    // Calculate streak
    let streak = 0;
    if (moods.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const uniqueDays = new Set();
        moods.forEach(m => {
            const d = new Date(m.timestamp);
            d.setHours(0, 0, 0, 0);
            uniqueDays.add(d.getTime());
        });
        const sortedDays = [...uniqueDays].sort((a, b) => b - a);
        // Check if today or yesterday has an entry
        const todayTime = today.getTime();
        const yesterdayTime = todayTime - 86400000;
        if (sortedDays[0] === todayTime || sortedDays[0] === yesterdayTime) {
            streak = 1;
            for (let i = 1; i < sortedDays.length; i++) {
                if (sortedDays[i] === sortedDays[i - 1] - 86400000) {
                    streak++;
                } else {
                    break;
                }
            }
        }
    }

    // Calculate average mood score (last 30 entries)
    const recentMoods = moods.slice(0, 30);
    const avgScore = recentMoods.length > 0
        ? Math.round(recentMoods.reduce((sum, m) => sum + (m.score || 50), 0) / recentMoods.length)
        : 0;

    return {
        totalMoods: moods.length,
        totalQuizzes: quizSnap.size,
        totalAssessments: assessSnap.size,
        totalChats: chatSnap.size,
        streak,
        avgScore,
        recentMoods: moods.slice(0, 7), // last 7 for weekly chart
    };
>>>>>>> Stashed changes
};
