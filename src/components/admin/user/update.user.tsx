import { Form, Input, message, Modal } from "antd";
import { useEffect, useState } from "react";
import type { FormProps } from "antd/lib";
import { updateUser } from "@/services/api";

interface IProp {
    openUpadteUser: boolean;
    setOpenUpdateUser: (v: boolean) => void;
    refreshTable: () => void;
    dataUpdateUser: IUser | null;
    setDataUpdateUser: (v: IUser | null) => void;
}

type FieldType = {
    _id: string;
    name: string;
    email: string;
    age: number;
    gender: string;
    role: string;
}

const UpdateUser = (props: IProp) => {

    const { openUpadteUser, setOpenUpdateUser, refreshTable, dataUpdateUser, setDataUpdateUser } = props;

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    useEffect(()=> {
        if(dataUpdateUser){
            form.setFieldsValue({
                _id: dataUpdateUser._id,
                name: dataUpdateUser.name,
                email: dataUpdateUser.email,
                age: dataUpdateUser.age,
                gender: dataUpdateUser.gender,
                role: dataUpdateUser.role?.name,
            });
        }
    }, [dataUpdateUser]);

    const handleCancel = () => {
        setOpenUpdateUser(false);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {

        const {name, age, gender, role } = values;
        setIsSubmit(true);
        const response = await updateUser(dataUpdateUser?._id,name, age, gender, role);
        console.log("check id: ", dataUpdateUser?._id);
        if (response && response.data) {
            form.resetFields();
            setOpenUpdateUser(false);
            setDataUpdateUser(null);
            refreshTable();
            messageApi.open({
                type: 'success',
                content: 'Cập nhật thành công',
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
            <Modal
                title="Basic Modal"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={openUpadteUser}
                onOk={() => form.submit()}
                onCancel={() => {
                    handleCancel(); setDataUpdateUser(null)
                }}
                confirmLoading={isSubmit}
            >
                <div>
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
                            <Input disabled style={{
                                width: "250px",
                                padding: "5px 5px"
                            }}/>
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Age"
                            name="age"
                        >
                            <Input style={{
                                width: "250px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Gender"
                            name="gender"
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
export default UpdateUser;