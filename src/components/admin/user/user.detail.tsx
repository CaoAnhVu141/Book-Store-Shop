import { Avatar, Button, Drawer } from "antd";
import { Descriptions } from 'antd';
import dayjs from "dayjs";


interface IProp {
    openDetailUser: boolean;
    setOpenDetailUser: (v: boolean) => void;
    dataDetailUser: IUserDetail | null;
    setDataDetailUser: (v: IUserDetail | null) => void;
}

const UserDetail = (props: IProp) => {

    const { openDetailUser, setOpenDetailUser, dataDetailUser, setDataDetailUser } = props;

    const onClose = () => {
        setOpenDetailUser(false);
        setDataDetailUser(null);
    };

    const imgAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${dataDetailUser?.avatar}`;

    return (
        <>
            <Drawer
                title="Thông tin User"
                width={"50vw"}
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={openDetailUser}
            >
                <Descriptions
                    title="User Info"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="ID">{dataDetailUser?._id}</Descriptions.Item>
                    <Descriptions.Item label="Name">{dataDetailUser?.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataDetailUser?.email}</Descriptions.Item>
                    <Descriptions.Item label="Role">{dataDetailUser?.role ? dataDetailUser?.role?.name : "Không có dữ liệu"}</Descriptions.Item>
                    <Descriptions.Item label="Avatar">
                        <Avatar style={{backgroundColor: "#00a2ae", verticalAlign: 'middle' }} size="large" src={imgAvatar}>
                        </Avatar>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">{dayjs(dataDetailUser?.createdAt).format('YYYY-MM-DD')}</Descriptions.Item>
                    <Descriptions.Item label="Updated At">{dayjs(dataDetailUser?.updatedAt).format('YYYY-MM-DD')}</Descriptions.Item>
                </Descriptions>;
            </Drawer>
        </>
    );
}

export default UserDetail;