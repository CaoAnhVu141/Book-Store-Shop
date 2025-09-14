import { createPayment } from "@/services/api";
import { message, Form, Modal, Input, DatePicker, Switch } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { FormProps } from "antd/lib";
import { useState } from "react";

interface Iprop {
    openCreatePayment: boolean;
    setOpenCreatePayment: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    name: string,
    description: string,
    status: boolean,
    startDate: Date,
    endDate: Date;
}

const CreatePayment = (props: Iprop) => {
    const { openCreatePayment, setOpenCreatePayment, refreshTable } = props;
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { name, description, status } = values;
        const response = await createPayment(name, description, status);
        if (response && response.data) {
            messageApi.open({
                type: 'success',
                content: 'Tạo mới thành công',
            });
            form.resetFields();
            setOpenCreatePayment(false);
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
        setOpenCreatePayment(false);
    }

    return (
        <>
            {contextHolder}
            <Modal
                title="Tạo mới danh mục"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={openCreatePayment}
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
                            label="Tên"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập mã tên!' }]}
                        >
                            <Input style={{
                                width: "250px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Mô tả"
                            name="description"
                            rules={[{ required: true, message: 'Vui lòng nhập tên mô tả' }]}
                        >
                            <TextArea style={{
                                width: "300px",
                                padding: "5px 5px"
                            }} />
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
export default CreatePayment;