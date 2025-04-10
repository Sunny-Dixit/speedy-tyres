// src/axiosConfig.js
/*import axios from 'axios';

const instance = axios.create({
      baseURL: 'https://api.speedy-tyres-v1.up7news.in/',
    //baseURL: 'http://localhost:9090/',
    headers: {
        'Content-Type': 'application/json',
    },
    console.log("Using Axios baseURL:", instance.defaults.baseURL);

});

export default instance;*/

// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.speedy-tyres-v1.up7news.in/',
  // baseURL: 'http://localhost:9090/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Log the base URL AFTER the instance is created
console.log("Using Axios baseURL:", instance.defaults.baseURL);

export default instance;

