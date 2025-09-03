import { updateCategory } from "@/services/api";
import { message, Modal, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { FormProps } from "antd/lib";
import { useEffect, useState } from "react";

interface IProp {
    openUpdateCategory: boolean;
    setOpenUpdateCategory: (v: boolean) => void;
    dataUpdateCategory: ICategory | null;
    setDataUpdateCategory: (v: ICategory | null) => void;
}

type FieldType = {
    name: string,
    description: string,
}

const UpdateCategory = (props: IProp) => {

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const { openUpdateCategory, setOpenUpdateCategory, dataUpdateCategory, setDataUpdateCategory,refreshTable } = props;

    useEffect(() => {
        if (dataUpdateCategory) {
            form.setFieldsValue({
                _id: dataUpdateCategory._id,
                name: dataUpdateCategory.name,
                description: dataUpdateCategory.description,
            });
        }
    }, [dataUpdateCategory]);


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { name, description } = values;
        setIsSubmit(true);
        const response = await updateCategory(dataUpdateCategory?._id, name, description);
        if (response && response.data) {
            messageApi.open({
                type: 'success',
                content: 'Cập nhật thành công',
            });
            form.resetFields();
            setOpenUpdateCategory(false);
            refreshTable();
            setIsSubmit(false);
        }
        else {
            messageApi.open({
                type: 'error',
                content: response.message,
            });
            setIsSubmit(false);
        }
    }

    const handleCancel = () => {
        setOpenUpdateCategory(false);
    }

    return (
        <>
            <Modal
                title="Cập nhật danh mục"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={openUpdateCategory}
                onOk={() => form.submit()}
                onCancel={() => {
                    handleCancel(); setDataUpdateCategory(null)
                }}
                confirmLoading={isSubmit}
            >
                <div style={{ display: "flex", left: "6px" }}>
                    {contextHolder}
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
                            rules={[{ required: true, message: 'Vui lòng nhập !' }]}
                        >
                            <Input style={{
                                width: "250px",
                                padding: "5px 10px"
                            }} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Mô tả"
                            name="description"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                        >
                            <TextArea rows={6} style={{
                                width: "320px",
                                padding: "5px 10px"
                            }} />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    )
}
export default UpdateCategory;