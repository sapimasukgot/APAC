import axios from "axios";

const BASE_URL = "https://apacbackend-production.up.railway.app";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
