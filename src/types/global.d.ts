
export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }
    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        results: T[],
    }

    // Định nghĩa một data type mới cho Login
    interface ILogin {
        access_token: string;
        user: {
            _id: string;
            name: string;
            email: string;
            role: string;
            avatar: string;
        }
    }

    interface IUser {
        _id: string;
        name: string;
        email: string;
        role: {
            _id: string,
            name: string,
        }
        avatar: string;
    }

    interface IFetchAccount {
        user: IUser;
    }
}