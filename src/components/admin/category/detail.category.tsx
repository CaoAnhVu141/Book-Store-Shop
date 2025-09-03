import { Avatar, Descriptions, Drawer } from "antd";
import dayjs from "dayjs";

interface IProp {
    openDetailCategory: boolean;
    setOpenDetailCategory: (v: boolean) => void;
    dataDetailCategory: ICategory | null;
    setDataDetailCategory: (v: ICategory | null) => void;
}

const DetailCategory = (props: IProp) => {

    const { openDetailCategory, setOpenDetailCategory, dataDetailCategory, setDataDetailCategory } = props;

    const onClose = () => {
        setOpenDetailCategory(false);
        setDataDetailCategory(null);
    }

    return (
        <>
            <Drawer
                title="Thông tin danh mục"
                width={"50vw"}
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={openDetailCategory}
            >
                <Descriptions
                    title="User Info"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="ID">{dataDetailCategory?._id}</Descriptions.Item>
                    <Descriptions.Item label="Danh mục">{dataDetailCategory?.name}</Descriptions.Item>
                    <Descriptions.Item label="Mô tả">{dataDetailCategory?.description}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">{dayjs(dataDetailCategory?.createdAt).format('YYYY-MM-DD')}</Descriptions.Item>
                    <Descriptions.Item label="Ngày cập nhật">{dayjs(dataDetailCategory?.updatedAt).format('YYYY-MM-DD')}</Descriptions.Item>
                </Descriptions>;
            </Drawer>
        </>
    )
}
export default DetailCategory;