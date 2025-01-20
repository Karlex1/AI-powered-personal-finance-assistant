import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Import Firestore (db) instance
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Firestore methods

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true); // To handle initial loading state

    // Monitor auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // Login function
    const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

    // Register function with additional user details
    const register = async (email, password, name, gender) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Save additional user details to Firestore
            const userRef = doc(db, "users", userCredential.user.uid);
            await setDoc(userRef, {
                name,
                email,
                gender,
            });

            return userCredential.user; // Return the created user
        } catch (error) {
            throw new Error(error.message); // Rethrow errors for handling
        }
    };

    // Reset password function
    const resetPassword = (email) => sendPasswordResetEmail(auth, email);

    // Logout function
    const logout = () => signOut(auth);

    return (
        <AuthContext.Provider value={{ currentUser, login, register, resetPassword, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
