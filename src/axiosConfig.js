// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://a8e9-103-225-187-236.ngrok-free.app/',  // Replace with your backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
