import { createCoupon } from "@/services/api";
import { Input, message, Modal, Form, DatePicker, Switch } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { FormProps } from "antd/lib";
import { useState } from "react";


interface IPops {
    openCreateAuthor: boolean;
    setOpenCreateAuthor: (v: boolean) => void
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


const CreateCoupon = (props: IPops) => {

    const { openCreateCoupon, setOpenCreateCoupon, refreshTable } = props;
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { code, name, discounType, discounValue, startDate, endDate, status } = values;
        const response = await createCoupon(code, name, discounType, discounValue, startDate, endDate, status);
        if (response && response.data) {
            messageApi.open({
                type: 'success',
                content: 'Tạo mới thành công',
            });
            form.resetFields();
            setOpenCreateCoupon(false);
            refreshTable();
            
        }
        else {
            messageApi.open({
                type: 'error',
                content: response.message,
            });
        }
        setIsSubmit(false);
    }

    const handleCanel = () => {
        setOpenCreateCoupon(false);
    }

    return (
        <>
            {contextHolder}
            <Modal
                title="Tạo mới danh mục"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={openCreateCoupon}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    handleCanel();
                    form.resetFields();
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
                            padding: "5px 5px"
                            }}
                        />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    )

}
export default CreateCoupon;