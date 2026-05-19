import { createContext, useState, useContext, useEffect } from 'react';

// 1. Creamos el contexto
export const AuthContext = createContext();

// 2. Definimos el proveedor
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) setUser({ loggedIn: true });
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        setUser({ loggedIn: true });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. ESTA ES LA LÍNEA CRÍTICA QUE TE FALTA O ESTÁ MAL ESCRITA
export const useAuth = () => useContext(AuthContext);