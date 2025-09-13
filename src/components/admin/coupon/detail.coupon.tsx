import { Descriptions, Drawer } from "antd";
import dayjs from "dayjs";

interface IProp {
    openDetailCoupon: boolean;
    setOpenDetailCoupon: (v: boolean) => void;
    dataDetailCoupon: ICoupon | null;
    setDataDetailCoupon: (v: ICoupon | null) => void;
}

const DetailCoupon = (props: IProp) => {

    const { openDetailCoupon, setOpenDetailCoupon, dataDetailCoupon, setDataDetailCoupon } = props;

    const onClose = () => {
        setOpenDetailCoupon(false);
        setDataDetailCoupon(null);
    }

    return (
        <>
            <Drawer
                title="Chi tiết giảm giá"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={openDetailCoupon}
                width={"50vw"}
            >
                <Descriptions
                    title="User Info"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="ID">{dataDetailCoupon?._id}</Descriptions.Item>
                    <Descriptions.Item label="Mã code">{dataDetailCoupon?.code}</Descriptions.Item>
                    <Descriptions.Item label="Tên">{dataDetailCoupon?.name}</Descriptions.Item>
                    <Descriptions.Item label="Ngày bắt đầu">{dayjs(dataDetailCoupon?.startDate).format('YYYY-MM-DD')}</Descriptions.Item>
                    <Descriptions.Item label="Ngày kết thúc">{dayjs(dataDetailCoupon?.endDate).format('YYYY-MM-DD')}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">{dataDetailCoupon?.status ? "Đang hoạt động" : "Không hoạt động"}</Descriptions.Item>
                    <Descriptions.Item label="Loại giảm giá">{dataDetailCoupon?.discounType}</Descriptions.Item>
                    <Descriptions.Item label="Tiền giảm">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataDetailCoupon?.discounValue)}
                    </Descriptions.Item>
                </Descriptions>;
            </Drawer>
        </>
    )
}
export default DetailCoupon;