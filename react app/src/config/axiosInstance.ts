import axios from "axios";

export const baseURL = "http://localhost:4000/";

export const baseIP = "localhost:4000";

const instance = axios.create({ baseURL });

export default instance;
