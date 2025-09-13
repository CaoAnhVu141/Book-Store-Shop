import { useEffect, useState } from "react";
import { Input, message, Modal, Form, DatePicker, Switch } from "antd";
import { updateCoupon } from "@/services/api";
import type { FormProps } from "antd/lib";
import dayjs from "dayjs";

interface IProp {
    openUpdateCoupon: boolean;
    setOpenUpdateCoupon: (v: boolean) => void;
    dataUpdateCoupon: ICoupon | null;
    setDataUpdateCoupon: (v: ICoupon | null) => void;
    refreshTable: () => void;
}

type FieldType = {
    code: string;
    name: string,
    discounType: string,
    discounValue: number,
    startDate: Date,
    endDate: Date;
    status: boolean,
}

const UpdateCoupon = (props: IProp) => {

    const {openUpdateCoupon, setOpenUpdateCoupon, dataUpdateCoupon, setDataUpdateCoupon, refreshTable} = props;

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    useEffect(() => {
        if (dataUpdateCoupon) {
            form.setFieldsValue({
                _id: dataUpdateCoupon._id,
                code: dataUpdateCoupon.code,
                name: dataUpdateCoupon.name,
                discounType: dataUpdateCoupon.discounType,
                discounValue: dataUpdateCoupon.discounValue,
                startDate: dataUpdateCoupon.startDate ? dayjs(dataUpdateCoupon.startDate) : null,
                endDate: dataUpdateCoupon.endDate ? dayjs(dataUpdateCoupon.endDate) : null, 
                status: dataUpdateCoupon.status,
            });
        }
    }, [dataUpdateCoupon]);



    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { code, name, discounType, discounValue, startDate, endDate, status } = values;
        const response = await updateCoupon(dataUpdateCoupon._id, code, name, discounType, discounValue, startDate, endDate, status);
        if (response && response.data) {
            messageApi.open({
                type: 'success',
                content: 'Cập nhật thành công',
            });
            form.resetFields();
            setOpenUpdateCoupon(false);
            refreshTable();
            setIsSubmit(false);
        }
        else {
            messageApi.open({
                type: 'error',
                content: response.message,
            });
        }
    }

    const handleCancel = () => {
        setOpenUpdateCoupon(false);
    }

    return (
        <>
            {contextHolder}
            <Modal
                title="Cập nhật mã giảm giá"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={openUpdateCoupon}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    handleCancel();
                    setDataUpdateCoupon(null);
                }}
                confirmLoading={isSubmit}
            >
                <div style={{ display: "flex", left: "10px" }}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 18 }}
                        style={{ maxWidth: 800 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="Mã code"
                            name="code"
                            rules={[{ required: true, message: 'Vui lòng nhập mã code!' }]}
                        >
                            <Input style={{
                                width: "250px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Tên mã"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên mã' }]}
                        >
                            <Input style={{
                                width: "250px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Loại giảm giá"
                            name="discounType"
                            rules={[{ required: true, message: 'Vui lòng nhập loại giảm giá' }]}
                        >
                            <Input style={{
                                width: "250px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Giá trị giảm"
                            name="discounValue"
                            rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm' }]}
                        >
                            <Input style={{
                                width: "250px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Ngày bắt đầu"
                            name="startDate"
                            rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu' }]}
                        >
                            <DatePicker
                                style={{
                                    width: "320px",
                                    padding: "5px 5px"
                                }}
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY/MM/DD HH:mm"
                            />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Ngày kết thúc"
                            name="endDate"
                            rules={[{ required: true, message: 'Vui lòng nhập ngày kết thúc' }]}
                        >
                            <DatePicker
                                style={{
                                    width: "320px",
                                    padding: "5px 5px"
                                }}
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY/MM/DD HH:mm"
                            />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Trạng thái"
                            name="status"
                            valuePropName="checked"
                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                        >
                            <Switch
                                style={{
                                    width: "30px",
                                    padding: "5px 5px",
                                }}
                            />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    )
}
export default UpdateCoupon;