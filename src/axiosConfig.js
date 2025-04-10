// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
    //baseURL: 'https://api.speedy-tyres-v1.up7news.in/',
    baseURL: 'http://localhost:9090/',



    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
