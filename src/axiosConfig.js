// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
    //baseURL: 'http://speedy-tyres.ap-south-1.elasticbeanstalk.com/',  // Replace with your backend URL
    baseURL: 'https://api.speedy-tyre.up7news.in/',  // Replace with your backend URL

    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
