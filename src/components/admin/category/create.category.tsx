import { createCategory } from "@/services/api";
import { Input, message, Modal, Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { FormProps } from "antd/lib";
import { useState } from "react";

interface IProp {
    openCreateCategory: boolean;
    setOpenCreateCategory: (v: boolean) => void;
}

type FieldType = {
    name: string,
    description: string,
}

const CreateCategory = (props: IProp) => {

    const { openCreateCategory, setOpenCreateCategory, refreshTable } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { name, description } = values;
        setIsSubmit(true);
        const response = await createCategory(name, description);
        if (response && response.data) {
            messageApi.open({
                type: 'success',
                content: 'Tạo mới thành công',
            });
            form.resetFields();
            setOpenCreateCategory(false);
            refreshTable();
        }
        else{
            messageApi.open({
                type: 'error',
                content: response.message,
            });
            setIsSubmit(false);
        }
    }

    return (
        <>
            {contextHolder}
            <Modal
                title="Tạo mới danh mục"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={openCreateCategory}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setOpenCreateCategory(false);
                    form.resetFields();
                }}
                confirmLoading={isSubmit}
            >
                <div style={{ display: "flex", left: "10px" }}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="Danh mục"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập danh mục!' }]}
                        >
                            <Input style={{
                                width: "250px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Mô tả"
                            name="description"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                        >
                            <TextArea rows={4} style={{
                                width: "320px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default CreateCategory;