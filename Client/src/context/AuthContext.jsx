import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || null;
        } catch (error) {
            console.error("Error parsing localStorage 'user' data:", error);
            return null;
        }
    });

    const updateUser = (data) => {
        try {
            setCurrentUser(data);
            localStorage.setItem("user", JSON.stringify(data));
            console.log("User updated:", data);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    useEffect(() => {
        try {
            localStorage.setItem("user", JSON.stringify(currentUser));
        } catch (error) {
            console.error("Error setting localStorage 'user' data:", error);
        }
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
