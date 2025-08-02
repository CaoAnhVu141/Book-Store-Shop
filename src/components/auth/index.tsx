import type React from "react";
import { useCurrentApp } from "../context/app.context";
import { Button, Result } from "antd";
import { useLocation } from 'react-router-dom'

interface IProps {
    children: React.ReactNode;
}


const ProtectedRoute = (props: IProps) => {

    const { isAuthenticated, user } = useCurrentApp();
    const location = useLocation();
    if (isAuthenticated === false) {
        return (
            <Result
                status="404"
                title="404"
                subTitle="Xin lỗi, không tìm thấy trang bạn yêu cầu."
                extra={<Button type="primary">Quay lại nào</Button>}
            />
        )
    }
    // check role.name == "USER" when role.name == "USER" you can not access with router admin
    const isRouterAdmin = location.pathname.includes('admin');
    
    if (isAuthenticated == true && isRouterAdmin == true) {
        const roleUser = user?.role.name;
        if (roleUser === "USER") {
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Xin lỗi, bạn không có quyền truy cập."
                    extra={<Button type="primary">Quay lại nào</Button>}
                />
            )
        }
    }
    return (
        <>
            {
                props.children
            }
        </>
    )
}

export default ProtectedRoute;