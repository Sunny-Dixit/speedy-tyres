// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
   //baseURL: 'https://api.speedy-tyres-v3.up7news.in/',
   baseURL: 'https://api.speedy-tyres-mail.dermrange.io/',
  //baseURL: 'http://localhost:8080/',


  headers: {
    'Content-Type': 'application/json',
  },
  
});

// ✅ Log the base URL AFTER the instance is created
console.log("Using Axios baseURL:", instance.defaults.baseURL);

export default instance;

