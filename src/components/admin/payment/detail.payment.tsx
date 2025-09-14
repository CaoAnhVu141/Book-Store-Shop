import { Descriptions, Drawer } from "antd";
import dayjs from "dayjs";

interface IProp {
    openDetailPayment: boolean;
    setOpenDetailPayment: (v: boolean) => void;
    dataDetailPayment: IPayment | null;
    setDataDetailPayment: (v: IPayment | null) => void;
}

const DetailPayment = (props: IProp) => {

    const {openDetailPayment,setOpenDetailPayment,dataDetailPayment,setDataDetailPayment} = props;

    const onClose = () => {
        setOpenDetailPayment(false);
        setDataDetailPayment(null);
    }

    return (
        <>
            <Drawer
                title="Chi tiết"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={openDetailPayment}
                width={"50vw"}
            >
                <Descriptions
                    title="Payment"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="ID">{dataDetailPayment?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên">{dataDetailPayment?.name}</Descriptions.Item>
                    <Descriptions.Item label="Mô tả">{dataDetailPayment?.description}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">{dataDetailPayment?.status ? "Đang hoạt động" : "Không hoạt động"}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">{dayjs(dataDetailPayment?.createdAt).format('YYYY-MM-DD')}</Descriptions.Item>
                </Descriptions>;
            </Drawer>
        </>
    )
}
export default DetailPayment;