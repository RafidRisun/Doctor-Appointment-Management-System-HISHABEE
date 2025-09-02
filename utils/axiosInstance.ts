import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://appointment-manager-node.onrender.com/api/v1",
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const jwtToken = localStorage.getItem('token');
            if (jwtToken) {
                config.headers.Authorization = `Bearer ${jwtToken}`;
            }
        }
        return config;
    },
    (error) => {
        console.error('Request Interceptor Error:', error);
        return Promise.reject(error);
    }
);

export default axiosInstance;