import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
        return unsubscribe;
    }, []);

    const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
    const register = (email, password) => createUserWithEmailAndPassword(auth, email, password);
    const resetPassword = (email) => sendPasswordResetEmail(auth, email);
    const logout = () => signOut(auth);

    return (
        <AuthContext.Provider value={{ currentUser, login, register, resetPassword, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
