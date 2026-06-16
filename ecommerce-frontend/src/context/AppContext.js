import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    );
    const [cartCount, setCartCount] = useState(0);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AppContext.Provider value={{ user, login, logout, cartCount, setCartCount }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);