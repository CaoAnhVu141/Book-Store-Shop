
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
        result: T[],
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

    interface IRegister {
        _id: string;
        email: string;
        name: string;
    }

    interface IUser {
        _id: string;
        name: string;
        email: string;
        role: {
            _id: string,
            name: string,
        }
        age: number;
        gender: string;
        avatar: string;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IUserDetail {
        _id: string;
        name: string;
        email: string;
        role: {
            _id: string;
            name: string;
        };
        avatar: string;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IFetchAccount {
        user: IUser;
    }

    interface ICreateUser {
        _id: string;
        name: string;
        email: string;
        role: string;
        avatar: string;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IImportUser {
        data: {
            name: string;
            email: string;
            password: string;
            role: string;
        }
    }

    interface ICategory{
        _id: string, 
        name: string,
        description: string,
        createdAt: Date;
        updatedAt: Date;
    }

    interface IAuthor{
        _id: string, 
        name: string,
        bio: string,
        createdAt: Date;
        updatedAt: Date;
    }

    interface ICoupon{
        _id: string, 
        name: string,
        code: string,
        discounType: string;
        discounValue: number;
        startDate: Date;
        endDate: Date;
        status: boolean;
    }
}