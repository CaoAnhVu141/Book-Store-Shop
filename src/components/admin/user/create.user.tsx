import { createNewUser } from "@/services/api";
import { Button, Form, Input, message, Modal } from "antd";
import type { FormProps } from "antd/lib";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


interface IProp {
    openCreateUser: boolean;
    setOpenCreateUser: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    name: string;
    email: string;
    password: string;
    age: number;
    gender: string;
    role: string;
}


const CreateUser = (props: IProp) => {
    const { openCreateUser, setOpenCreateUser, refreshTable } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {

        const { name, email, password, age, gender, role } = values;
        setIsSubmit(true);
        const response = await createNewUser(name, email, password, age, gender, role);
        console.log("check response: ", response);
        if (response && response.data) {
            form.resetFields();
            setOpenCreateUser(false);
            refreshTable();
            messageApi.open({
                type: 'success',
                content: 'Tạo mới thành công',
            });
        }
        else {
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
                title="Tạo mới người dùng"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={openCreateUser}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setOpenCreateUser(false);
                    form.resetFields();
                }}
                confirmLoading={isSubmit}
            >
                <div>
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
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập name!' }]}
                        >
                            <Input style={{
                                width: "250px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                        >
                            <Input style={{
                                width: "250px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password style={{
                                width: "250px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Age"
                            name="age"
                            rules={[{ required: true, message: 'Vui lòng nhập age!' }]}
                        >
                            <Input style={{
                                width: "250px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Gender"
                            name="gender"
                            rules={[{ required: true, message: 'Vui lòng nhập gender!' }]}
                        >
                            <Input style={{
                                width: "250px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Role"
                            name="role"
                            rules={[{ required: true, message: 'Vui lòng nhập role!' }]}
                        >
                            <Input style={{
                                width: "250px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default CreateUser;