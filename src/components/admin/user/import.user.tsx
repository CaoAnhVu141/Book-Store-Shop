import { InboxOutlined } from "@ant-design/icons";
import { message, Modal, Table, Upload } from "antd";
import type { UploadProps } from 'antd';
import { useState } from "react";
import Exceljs from 'exceljs';
import { Buffer } from "buffer";

interface IProp {
    openImportUser: boolean;
    setImportUser: (v: boolean) => void;
}

interface IDataImport {
    key: string;
    name: string;
    email: string;
    role: string;
}


const ImportUser = (props: IProp) => {

    const { openImportUser, setImportUser } = props;
    const { Dragger } = Upload;

    const [dataImport, setDataImport] = useState<IDataImport[]>([]);

    const [messageApi, contextHolder] = message.useMessage();

    const propUpload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: "text/plain, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        customRequest({ file, onSuccess }) {
            setTimeout(() => {
                if (onSuccess) onSuccess("ok");
            }, 1000);
        },
        async onChange(info) {
            const { status } = info.file;
            console.log("check info: ", info);
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;
                    await handleUploadFile(file);
                    messageApi.open({
                        type: 'success',
                        content: `Import ${info.file.name} thành công`,
                    });
                }
                else {
                    messageApi.open({
                        type: 'error',
                        content: "Import chưa thành công",
                    });
                }
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

    const handleUploadFile = async (file: any) => {
        const workbook = new Exceljs.Workbook();
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer);
        await workbook.xlsx.load(buffer);

        //convert file to json
        let jsonData: IDataImport[] = [];
        workbook.worksheets.forEach(function (sheet) {
            // read first row as data keys
            let firstRow = sheet.getRow(1);
            if (!firstRow.cellCount) return;

            let keys = firstRow.values as any[];

            sheet.eachRow((row, rowNumber) => {
                if (rowNumber == 1) return;
                let values = row.values as any;
                let obj: any = {};
                for (let i = 1; i < keys.length; i++) {
                    obj[keys[i]] = values[i];
                }
                jsonData.push(obj);
            })

        });
        jsonData = jsonData.map((item, index) => {
            return { ...item, id: index + 1 }
        })
        setDataImport(jsonData)
    }

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
            <Dragger {...propUpload}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                    banned files.
                </p>
            </Dragger>
            {contextHolder}
            <div style={{ marginTop: 20 }}>
                <Table
                    columns={columns}
                    dataSource={dataImport}
                    scroll={{ y: 240 }}
                    pagination={false}
                />
            </div>
        </Modal>
    )
}

export default ImportUser;