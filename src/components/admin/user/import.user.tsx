import { InboxOutlined } from "@ant-design/icons";
import { message, Modal, Space, Table, Upload } from "antd";
import Dragger from "antd/es/upload/Dragger";
import type { UploadProps } from 'antd';

interface IProp {
    openImportUser: boolean;
    setImportUser: (v: boolean) => void;
}

interface DataType {
    key: string;
    name: string;
    email: string;
    role: string;
}


const ImportUser = (props: IProp) => {

    const { openImportUser, setImportUser } = props;
    const { Dragger } = Upload;


    const propUpload: UploadProps  = {
        name: 'file',
        multiple: false,
        maxCount:1,
        // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        accept: "text/plain, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        customRequest({file, onSuccess}){
            setTimeout(() => {
                if(onSuccess) onSuccess("ok");
            }, 1000);
        },
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <a>{text}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
    ];

    const data: DataType[] = [
        {
            key: '1',
            name: 'John Brown',
            email: "Kim@gmail.com",
            role: "Admin",
        },
        {
            key: '2',
            name: 'Jim Green',
            email: "huhu@gmail.com",
            role: "User"
        },
        {
            key: '3',
            name: 'Joe Black',
            email: "huhu@gmail.com",
            role: "Nhân viên"
        },
    ];

    return (
        <Modal
            title="Basic Modal"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={openImportUser}
            onCancel={() => {
                setImportUser(false)
            }}
            width={800}
            okText="Import Data"
            maskClosable={false}
        >
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                    banned files.
                </p>
            </Dragger>
            <div style={{ marginTop: 20 }}>
                <Table
                    columns={columns}
                    dataSource={data}
                    scroll={{ y: 240 }}
                    pagination={false}
                />
            </div>
        </Modal>
    )
}

export default ImportUser;