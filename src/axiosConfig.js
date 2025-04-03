// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:9090/',  // Replace with your backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
