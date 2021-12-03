import axios from "axios";

export const baseURL = "http://192.168.0.105:4001/";

export const baseIP = "192.168.0.105:4001";

const instance = axios.create({ baseURL });

export default instance;
