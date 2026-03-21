import axios from 'axios';

const localServer = axios.create({
  baseURL: '/api/local',
  headers: {
    'content-type': 'application/json'
  }
});

export default localServer;
