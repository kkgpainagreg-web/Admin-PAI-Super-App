/**
 * Authentication Module
 * ADMIN PAI Super App
 */

// Login with Email and Password
async function loginWithEmail(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update last login
        await db.collection('users').doc(user.uid).update({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        return user;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Register with Email and Password
async function registerWithEmail(email, password, name, level) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update profile
        await user.updateProfile({
            displayName: name
        });
        
        // Create user document in Firestore
        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            email: email,
            name: name,
            level: level,
            role: 'teacher',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            profile: {
                nip: '',
                phone: '',
                address: '',
                photo: ''
            },
            school: {
                name: '',
                npsn: '',
                address: '',
                principalName: '',
                principalNip: ''
            },
            settings: {
                theme: 'light',
                notifications: true
            }
        });
        
        return user;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

// Login with Google
async function loginWithGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        });
        
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        const isNewUser = result.additionalUserInfo.isNewUser;
        
        if (isNewUser) {
            // Create user document for new Google users
            await db.collection('users').doc(user.uid).set({
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                level: '',
                role: 'teacher',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                profile: {
                    nip: '',
                    phone: '',
                    address: '',
                    photo: user.photoURL || ''
                },
                school: {
                    name: '',
                    npsn: '',
                    address: '',
                    principalName: '',
                    principalNip: ''
                },
                settings: {
                    theme: 'light',
                    notifications: true
                }
            });
        } else {
            // Update last login for existing users
            await db.collection('users').doc(user.uid).update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        return user;
    } catch (error) {
        console.error('Google login error:', error);
        throw error;
    }
}

// Reset Password
async function resetPassword(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        return true;
    } catch (error) {
        console.error('Password reset error:', error);
        throw error;
    }
}

// Logout
async function logout() {
    try {
        await auth.signOut();
        sessionStorage.clear();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

// Check if user is logged in
function isLoggedIn() {
    return auth.currentUser !== null;
}

// Get current user
function getCurrentUser() {
    return auth.currentUser;
}

// Get user data from Firestore
async function getUserData(uid) {
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
            return doc.data();
        }
        return null;
    } catch (error) {
        console.error('Get user data error:', error);
        throw error;
    }
}

// Update user data
async function updateUserData(uid, data) {
    try {
        await db.collection('users').doc(uid).update({
            ...data,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Update user data error:', error);
        throw error;
    }
}

// Update user profile
async function updateUserProfile(uid, profileData) {
    try {
        await db.collection('users').doc(uid).update({
            profile: profileData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update Firebase Auth profile if name changed
        if (profileData.name && auth.currentUser) {
            await auth.currentUser.updateProfile({
                displayName: profileData.name
            });
        }
        
        return true;
    } catch (error) {
        console.error('Update profile error:', error);
        throw error;
    }
}

// Update school data
async function updateSchoolData(uid, schoolData) {
    try {
        await db.collection('users').doc(uid).update({
            school: schoolData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Update school data error:', error);
        throw error;
    }
}

// Check auth state and redirect
function checkAuthState(redirectIfLoggedIn = false, redirectUrl = 'dashboard.html') {
    auth.onAuthStateChanged((user) => {
        if (user && redirectIfLoggedIn) {
            window.location.href = redirectUrl;
        } else if (!user && !redirectIfLoggedIn) {
            window.location.href = 'login.html';
        }
    });
}

// Export functions
window.loginWithEmail = loginWithEmail;
window.registerWithEmail = registerWithEmail;
window.loginWithGoogle = loginWithGoogle;
window.resetPassword = resetPassword;
window.logout = logout;
window.isLoggedIn = isLoggedIn;
window.getCurrentUser = getCurrentUser;
window.getUserData = getUserData;
window.updateUserData = updateUserData;
window.updateUserProfile = updateUserProfile;
window.updateSchoolData = updateSchoolData;
window.checkAuthState = checkAuthState;