
import axios from "services/axios.customize"

export const loginAPI = (username: string, password: string) => {
    const urlBackend = `/api/v1/auth/login`;
    
    return axios.post<IBackendRes<ILogin>>(urlBackend, {username,password});
}

export const registerAPI = (name: string,email: string,password: string) => {
    const urlBackend = `/api/v1/auth/register`;
    const data = {
        name: name, email: email, password: password,
    }
    return axios.post(urlBackend,data);
}