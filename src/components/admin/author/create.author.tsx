import type { FormProps } from "antd/lib";
import { Input, message, Modal, Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import { createAuthor } from "@/services/api";
import { useState } from "react";

interface IPops {
    openCreateAuthor: boolean;
    setOpenCreateAuthor: (v: boolean) => void
    refreshTable: () => void;
}

type FieldType = {
    name: string,
    bio: string,
}

const CreateAuthor = (props: IPops) => {

    const {openCreateAuthor, setOpenCreateAuthor, refreshTable} = props;
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const {name, bio} = values;
        setIsSubmit(true)
        const response = await createAuthor(name, bio);
        if(response && response.data){
            messageApi.open({
                type: 'success',
                content: 'Tạo mới thành công',
            });
            form.resetFields();
            setOpenCreateAuthor(false);
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

    const handleCanel = () => {
        setOpenCreateAuthor(null);
        openCreateAuthor(false);
    }

    return (
        <>
            {contextHolder}
            <Modal
                title="Tạo mới danh mục"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={openCreateAuthor}
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
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="Tác giả"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tác giả!' }]}
                        >
                            <Input style={{
                                width: "250px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Bio"
                            name="bio"
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
export default CreateAuthor;