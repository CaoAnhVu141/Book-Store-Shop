import { loginAPI, registerAPI } from '@/services/api';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';

const LoginPage = () => {

    interface IUserLogin {
        email: string,
        password: string,
    }


    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const onFinish: FormProps<IUserLogin>['onFinish'] = async (values) => {
        const { email, password } = values
        const response = await loginAPI(email, password);

        if (response.data) {
            localStorage.setItem("access_token", response.data.access_token);
            messageApi.open({
                type: 'success',
                content: 'Đăng nhập thành công',
            });
            setTimeout(() => {
                navigate('/')
            }, 1500);
        }
        else {
            messageApi.open({
                type: 'error',
                content: response.message,
            });
        }
    }
    return (
        <>
            {contextHolder}
            <div className='all-form-register' style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#f0f2f5",
                margin: 0, padding: 0
            }}>
                <div className='form-register' style={{
                    background: "white",
                    padding: "40px 10px",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                    width: "100%",
                    maxWidth: "500px",
                    maxHeight: "500px",
                    justifyContent: "center"
                }}>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input style={{
                                width: "250px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password style={{
                                width: "250px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>

                        <Form.Item label={null} style={{ display: "flex", justifyContent: "center", }}>
                            <Button type="primary" htmlType="submit">
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    )
}
export default LoginPage;