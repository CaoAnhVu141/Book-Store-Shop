import { Descriptions, Drawer } from "antd";
import dayjs from "dayjs";

interface Iprop{
    openDetailWareHouse: boolean;
    setOpenDetailWareHouse: (v: boolean) => void;
    dataDetailWareHouse: IWareHouse | null;
    setDataDetailWareHouse: (v: IWareHouse | null) => void;
}

const DetailWareHouse = (props: Iprop) => {

    const {openDetailWareHouse, setOpenDetailWareHouse, dataDetailWareHouse, setDataDetailWareHouse} = props;

    const onClose = () => {
        setOpenDetailWareHouse(false);
        setDataDetailWareHouse(null);
    }

    return (
        <>
            <Drawer
                title="Chi tiết"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={openDetailWareHouse}
                width={"50vw"}
            >
                <Descriptions
                    title="WareHouse"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="ID">{dataDetailWareHouse?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên">{dataDetailWareHouse?.name}</Descriptions.Item>
                    <Descriptions.Item label="Mô tả">{dataDetailWareHouse?.description}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">{dataDetailWareHouse?.location}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">{dataDetailWareHouse?.status ? "Đang hoạt động" : "Không hoạt động"}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">{dayjs(dataDetailWareHouse?.createdAt).format('YYYY-MM-DD')}</Descriptions.Item>
                </Descriptions>;
            </Drawer>
        </>
    )

}
export default DetailWareHouse;