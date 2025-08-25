import { InboxOutlined } from "@ant-design/icons";
import { Modal, Space, Table } from "antd";
import Dragger from "antd/es/upload/Dragger";

interface IProp {
    openImportUser: boolean;
    setImportUser: (v: boolean) => void;
}

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const ImportUser = (props: IProp) => {

    const { openImportUser, setImportUser } = props;
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <a>{text}</a>,
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: DataType) => (
                <Space size="middle">
                    <a>Invite {record.name}</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];

    const data: DataType[] = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney No. 1 Lake Park',
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