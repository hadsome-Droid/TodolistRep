import axios from "axios";

export const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        'API-KEY': import.meta.env.VITE_API_KEY,
    }
})

// instance.interceptors.response.use(function (config) {
//     config.headers['Authorization'] = `Bearer ${localStorage.getItem('sn-token')}`
//     return config;
// })

instance.interceptors.request.use(function (config) {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('sn-token')}`

    return config
})