import { Descriptions, Drawer } from "antd";
import dayjs from "dayjs";

interface IProp {
    openDetailBook: boolean;
    setOpenDetailBook: (v: boolean) => void;
    dataDetailBook: IBook | null;
    setDataDetailBook: (v: IBook | null) => void;
}

const DetailBook = (props: IProp) => {

    const { openDetailBook, setOpenDetailBook, dataDetailBook, setDataDetailBook } = props;
    const onClose = () => {
        setOpenDetailBook(false);
        setDataDetailBook(null);
    }

    return (
        <>
            <Drawer
                title="Thông tin sách"
                width={"50vw"}
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={openDetailBook}
            >
                <Descriptions
                    title="Book"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="ID">{dataDetailBook?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên" style={{ width: "160px" }}>{dataDetailBook?.name}</Descriptions.Item>
                    <Descriptions.Item label="Mô tả">{dataDetailBook?.description}</Descriptions.Item>
                    <Descriptions.Item label="Giá">{dataDetailBook?.price}</Descriptions.Item>
                    <Descriptions.Item label="Tồn kho">{dataDetailBook?.stock}</Descriptions.Item>
                    <Descriptions.Item label="Tác giả">{dataDetailBook?.author ? dataDetailBook?.author?.name : "Không có dữ liệu"}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">{dayjs(dataDetailBook?.createdAt).format('YYYY-MM-DD')}</Descriptions.Item>
                    <Descriptions.Item label="Ngày cập nhật">{dayjs(dataDetailBook?.updatedAt).format('YYYY-MM-DD')}</Descriptions.Item>
                </Descriptions>;
            </Drawer>
        </>
    )

}
export default DetailBook;