
import axios from "services/axios.customize"

export const loginAPI = (username: string, password: string) => {
    const urlBackend = `/api/v1/auth/login`;
    
    return axios.post<IBackendRes<ILogin>>(urlBackend, {username,password},{
        headers: {
            delay: 1500,
        }
    });
}

export const registerAPI = (name: string,email: string,password: string) => {
    const urlBackend = `/api/v1/auth/register`;
    const data = {
        name: name, email: email, password: password,
    }
    return axios.post(urlBackend,data);
}

export const fetchAccountAPI = () => {
    const urlBackend = `/api/v1/auth/account`;
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend,{
        headers: {
            delay: 1500
        }
    });
}

export const logoutAPI = () => {
    const urlBackend = `/api/v1/auth/logout`;
    return axios.post<IBackendRes<IRegister>>(urlBackend,{
        Headers: {
            delay: 1500,
        }
    });
}

export const fetchListUser= (current: number, pageSize: number) =>  {
    const urlBackend = `api/v1/users?current=${current}&pageSize=${pageSize}`;
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(urlBackend);
}