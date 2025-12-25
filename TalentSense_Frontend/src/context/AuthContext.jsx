import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);


    // chech session on app load
    const checkAuth = async () => {
        const token = localStorage.getItem("token");
        if(!token){
            setLoading(false)
            return;
        }
        try {
            const res = await api.get('/auth/me');
            setUser(res.data.user);
        } catch (error) {
            setUser(null);
            localStorage.removeItem("token");
        }finally{
            setLoading(false);
        }
    };

    useEffect(() =>{
        checkAuth();
    },[]);

    // Login
    const login = async ( email, password ) => {
        const res = await api.post('/auth/login', { email, password });

        // assuming backend return {token}
        localStorage.setItem("token", res.data.token);

        // fetch user after login
        const me = await api.get('/auth/me');
        setUser(me.data.user)
    };

    //logout
    const logout = () =>{
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/login";
    };

    //register
    const register = async (name, email, password) => {
        const res = await api.post('/auth/register',{
            name,
            email,
            password,
        });

        if (res.data.token){
            localStorage.setItem("token", res.data.token);
            const me = await api.get('/auth/me');
            setUser(me.data.user)
        } else {
            await login(email, password);
        };
    }

    return(
        <AuthContext.Provider
        value={{ user, loading, login, logout, register }}
        >
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);