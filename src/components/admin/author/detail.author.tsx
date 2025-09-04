import { Descriptions, Drawer } from "antd";
import dayjs from "dayjs";

interface IProp {
    openDetailAuthor: boolean;
    setOpenDetailAuthor: (v: boolean) => void;
    dataDetailAuthor: IAuthor | null;
    setDataDetailAuthor: (v: IAuthor | null) => void;
}

const DetailAuthor = (props: IProp) => {

    const { openDetailAuthor, setOpenDetailAuthor, dataDetailAuthor, setDataDetailAuthor } = props;

    const onClose = () => {
        setOpenDetailAuthor(false);
        setDataDetailAuthor(null);
    }

    return (
        <>
            <Drawer
                title="Basic Drawer"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={openDetailAuthor}
                width={"50vw"}
            >
            <Descriptions
                    title="User Info"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="ID">{dataDetailAuthor?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tác giả">{dataDetailAuthor?.name}</Descriptions.Item>
                    <Descriptions.Item label="Bio">{dataDetailAuthor?.bio}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">{dayjs(dataDetailAuthor?.createdAt).format('YYYY-MM-DD')}</Descriptions.Item>
                    <Descriptions.Item label="Ngày cập nhật">{dayjs(dataDetailAuthor?.updatedAt).format('YYYY-MM-DD')}</Descriptions.Item>
                </Descriptions>;
            </Drawer>
        </>
    )
}

export default DetailAuthor;