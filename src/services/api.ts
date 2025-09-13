
import axios from "services/axios.customize"

export const loginAPI = (username: string, password: string) => {
    const urlBackend = `/api/v1/auth/login`;

    return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password }, {
        headers: {
            delay: 1500,
        }
    });
}

export const registerAPI = (name: string, email: string, password: string) => {
    const urlBackend = `/api/v1/auth/register`;
    const data = {
        name: name, email: email, password: password,
    }
    return axios.post(urlBackend, data);
}

export const fetchAccountAPI = () => {
    const urlBackend = `/api/v1/auth/account`;
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
        headers: {
            delay: 1500
        }
    });
}

export const logoutAPI = () => {
    const urlBackend = `/api/v1/auth/logout`;
    return axios.post<IBackendRes<IRegister>>(urlBackend, {
        Headers: {
            delay: 1500,
        }
    });
}


export const fetchListUser = (query: string) => {
    const urlBackend = `api/v1/users?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(urlBackend);
}

export const fetchUserById = (_id: string) => {
    const urlBackend = `api/v1/users/${_id}`;
    return axios.get<IBackendRes<IModelPaginate<IUserDetail>>>(urlBackend);
}

export const createNewUser = (name: string, email: string, password: string, age: number, gender: string, role: string) => {
    const urlBackend = `api/v1/users`;
    const data = {
        name: name, email: email, password: password, age: age, gender: gender, role: role,
    }
    return axios.post<IBackendRes<ICreateUser>>(urlBackend, data);
}

export const deteleUser = (_id: string) => {
    const urlBackend = `api/v1/users/${_id}`;
    return axios.delete<IBackendRes<IUser>>(urlBackend);
}

export const uploadFileExcel = (data: any) => {
    const urlBackend = `api/v1/file-excel/import`;

    // Gửi đối tượng có trường `data`, trong đó chứa mảng các đối tượng
    return axios.post(urlBackend, { data });
};


export const exportFileExcel = (data: any[]) => {
    const urlBackend = `api/v1/file-excel/export`;
    return axios.post(urlBackend, data, {
        responseType: 'blob',
    });
}

export const fetchDataUpdateUserById = (_id: string) => {
    const urlBackend = `api/v1/users/${_id}`;
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(urlBackend);
}

export const updateUser = (_id: string, name: string, age: number, gender: string, role: string) => {
    const urlBackend = `api/v1/users/${_id}`;
    const data = {
        name: name, age: age, gender: gender, role: role
    }
    return axios.patch<IBackendRes<IUser>>(urlBackend, data);
}


/// api with category
export const fetchAllCategory = (query: string) => {
    const urlBackend = `api/v1/categories?${query}`;
    return axios.get<IBackendRes<IModelPaginate<ICategory>>>(urlBackend);
}

export const createCategory = (name: string, description: string) => {
    const urlBackend = "api/v1/categories";
    const data = { name, description };
    return axios.post<IBackendRes<ICategory>>(urlBackend, data);
}

export const deteleCategory = (_id: string) => {
    const urlBackend = `api/v1/categories/${_id}`;
    return axios.delete<IBackendRes<ICategory>>(urlBackend)
}

export const fetchCategoryById = (_id: string) => {
    const urlBackend = `api/v1/categories/${_id}`;
    return axios.get<IBackendRes<ICategory>>(urlBackend);
}

export const updateCategory = (_id: string, name: string, description: string) => {
    const urlBackend = `api/v1/categories/${_id}`;
    const data = {
        name: name, description: description,
    }
    return axios.patch<IBackendRes<ICategory>>(urlBackend, data);
}

/// api with author
export const fetchListAuthor = (query: string) => {
    const urlBackend = `api/v1/authors?${query}`;
    return axios.get<IBackendRes<IAuthor>>(urlBackend);
}

export const fetchAuthorById = (_id: string) => {
    const urlBackend = `api/v1/authors/${_id}`;
    return axios.get<IBackendRes<IAuthor>>(urlBackend);
}

export const deleteAuthor = (_id: string) => {
    const urlBackend = `api/v1/authors/${_id}`;
    return axios.delete<IBackendRes<IAuthor>>(urlBackend);
}

export const createAuthor = (name: string, bio: string) => {
    const urlBackend = `api/v1/authors`;
    const data = { name, bio };
    return axios.post<IBackendRes<IAuthor>>(urlBackend,data);
}

/// api with coupon
export const fetchListCoupon = (query: string) => {
    const urlBackend = `api/v1/coupon?${query}`;
    return axios.get<IBackendRes<ICoupon>>(urlBackend);
}

export const fetchCouponById = (_id: string) => {
    const urlBackend = `api/v1/coupon/${_id}`;
    return axios.get<IBackendRes<ICoupon>>(urlBackend);

}


