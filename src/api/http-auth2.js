import axios from "axios";
import { URL_API_Portal } from "./env";

const http = axios.create({
    baseURL: URL_API_Portal,
    headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('usertoken')}`,
        'Access-Control-Allow-Methods':'*',
    }
})

export default http;