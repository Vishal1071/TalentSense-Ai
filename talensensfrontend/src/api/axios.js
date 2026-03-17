import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

//Request attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


// Response : Handle auth failure
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response && error.response.status === 401 ){
            localStorage.removeItem("token");
        }
        return Promise.reject(error);
    }
);


export default api;