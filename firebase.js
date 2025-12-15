import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBECQksrlWkWOTP4jriMmA9thfcKgbHyuE",
  authDomain: "codrcrew.firebaseapp.com",
  databaseURL: "https://codrcrew.firebaseio.com",
  projectId: "codrcrew",
  storageBucket: "codrcrew.appspot.com",
  messagingSenderId: "517463115484",
  appId: "1:517463115484:web:93ce55f61c78b015371619",
  measurementId: "G-Z9TTWE5FSJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const analytics = getAnalytics(app);

let currentUser = null;

function showAuthModal() {
    document.getElementById('auth-modal').classList.add('active');
}

function hideAuthModal() {
    document.getElementById('auth-modal').classList.remove('active');
}

function showAuthError(message) {
    const errorEl = document.getElementById('auth-error');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    setTimeout(() => {
        errorEl.style.display = 'none';
    }, 5000);
}

async function handleSignup(email, password, username) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await set(ref(database, 'sudoku_game/users/' + user.uid), {
            username: username,
            email: email,
            createdAt: Date.now(),
            stats: {
                gamesPlayed: 0,
                gamesWon: 0,
                totalTime: 0,
                bestTime: null
            }
        });
        
        hideAuthModal();
        return user;
    } catch (error) {
        showAuthError(error.message);
        throw error;
    }
}

async function handleLogin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        hideAuthModal();
        return userCredential.user;
    } catch (error) {
        showAuthError(error.message);
        throw error;
    }
}

async function handleLogout() {
    try {
        await signOut(auth);
        currentUser = null;
        updateUIForAuth(null);
    } catch (error) {
        console.error('Logout error:', error);
    }
}

async function getUserProfile(uid) {
    try {
        const snapshot = await get(ref(database, 'sudoku_game/users/' + uid));
        if (snapshot.exists()) {
            return snapshot.val();
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        return null;
    }
}

async function updateUserStats(uid, stats) {
    try {
        await update(ref(database, 'sudoku_game/users/' + uid + '/stats'), stats);
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

async function recordGameCompletion(uid, timeInSeconds) {
    try {
        const profile = await getUserProfile(uid);
        if (profile) {
            const stats = profile.stats || {};
            const newStats = {
                gamesPlayed: (stats.gamesPlayed || 0) + 1,
                gamesWon: (stats.gamesWon || 0) + 1,
                totalTime: (stats.totalTime || 0) + timeInSeconds,
                bestTime: stats.bestTime ? Math.min(stats.bestTime, timeInSeconds) : timeInSeconds
            };
            await updateUserStats(uid, newStats);
        }
    } catch (error) {
        console.error('Error recording game completion:', error);
    }
}

function updateUIForAuth(user) {
    const authBtn = document.getElementById('auth-btn');
    const userInfo = document.getElementById('user-info');
    const usernameEl = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (user) {
        authBtn.style.display = 'none';
        userInfo.style.display = 'flex';
        
        getUserProfile(user.uid).then(profile => {
            if (profile) {
                usernameEl.textContent = profile.username || user.email;
            }
        });
        
        logoutBtn.onclick = handleLogout;
    } else {
        authBtn.style.display = 'block';
        userInfo.style.display = 'none';
    }
}

onAuthStateChanged(auth, (user) => {
    currentUser = user;
    updateUIForAuth(user);
});

document.getElementById('show-login-btn').addEventListener('click', () => {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
});

document.getElementById('show-signup-btn').addEventListener('click', () => {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    await handleLogin(email, password);
});

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const username = document.getElementById('signup-username').value;
    await handleSignup(email, password, username);
});

document.getElementById('auth-btn').addEventListener('click', showAuthModal);
document.getElementById('auth-modal-close').addEventListener('click', hideAuthModal);

export { auth, database, currentUser, recordGameCompletion, getUserProfile };
