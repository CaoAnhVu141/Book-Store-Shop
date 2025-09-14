import { createWareHouse } from "@/services/api";
import { message, type FormProps, Form, Switch, Input, Modal, Select, Col, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useEffect, useState } from "react";

interface IProp {
    openCreateWareHouse: boolean;
    setOpenCreateWareHouse: (v: boolean) => void;
}

const { Option } = Select;

interface Province {
    code: number;
    name: string;
    districts: Ward[];
}

interface Ward {
    code: number;
    name: string;
}

type FieldType = {
    name: string,
    description: string,
    status: boolean,
    startDate: Date,
    endDate: Date;
    street?: string;
    province?: number;
    ward?: number;
}

const CreateWareHouse = (props: IProp) => {

    const { openCreateWareHouse, setOpenCreateWareHouse,refreshTable } = props;
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    useEffect(() => {
        if (openCreateWareHouse) {
            fetchProvinces();
        }
    }, [openCreateWareHouse]);

    ///function Province
    const fetchProvinces = async () => {
        try {
            const response = await fetch('https://provinces.open-api.vn/api/v2/');
            const data = await response.json();
            setProvinces(data);
        } catch (error) {
            message.error('Không thể tải danh sách tỉnh/thành phố');
        }
    }


    // function Wards
    const fetchWards = async (provinceCode: number) => {
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`);
            const data = await response.json();
            setWards(data.wards || []);
            form.setFieldsValue({ ward: undefined });
        } catch (error) {
            message.error('Không thể tải danh sách phường');
        }
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        // thực thi tìm tên phường
        const selectedProvince = provinces.find(p => p.code === values.province);
        const selectedWard = wards.find(w => w.code === values.ward);

        //tạo location đầy đủ
        const location = `${values.street}, ${selectedWard?.name}, ${selectedProvince?.name}`;

        const { name, description, status } = values;
        const response = await createWareHouse(name, description, location, status);
        if (response && response.data) {
            messageApi.open({
                type: 'success',
                content: 'Tạo mới thành công',
            });
            form.resetFields();
            setOpenCreateWareHouse(false);
            refreshTable();
            setIsSubmit(false);
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
        setOpenCreateWareHouse(false);
    }

    return (
        <>
            {contextHolder}
            <Modal
                title="Tạo mới kho"
                open={openCreateWareHouse}
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
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="Tên kho"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên kho!' }]}
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
                            <TextArea style={{
                                width: "300px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>
                        <Form.Item
                            label="Tỉnh"
                            name="province"
                            rules={[{ required: true, message: 'Chọn tỉnh!' }]}
                        >
                            <Select
                                placeholder="Chọn tỉnh"
                                onChange={fetchWards}
                                showSearch
                                style={{
                                    width: "200px",
                                    height: "50px",
                                    padding: "5px 5px"
                                }}
                            >
                                {provinces.map(province => (
                                    <Option key={province.code} value={province.code}>
                                        {province.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Phường/Xã"
                            name="ward"
                            rules={[{ required: true, message: 'Chọn phường!' }]}
                        >
                            <Select
                                placeholder="Phường/Xã"
                                disabled={wards.length === 0}
                                showSearch
                                style={{
                                    width: "200px",
                                    height: "50px",
                                    padding: "5px 5px"
                                }}
                            >
                                {wards.map(ward => (
                                    <Option key={ward.code} value={ward.code}>
                                        {ward.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Tên đường"
                            name="street"
                            rules={[{ required: true, message: 'Nhập tên đường!' }]}
                        >
                            <Input style={{
                                width: "250px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Trạng thái"
                            name="status"
                            valuePropName="checked"
                            initialValue={true}
                        >
                            <Switch />
                        </Form.Item>
                    </Form>
                </div>
            </Modal >
        </>
    )
}
export default CreateWareHouse;