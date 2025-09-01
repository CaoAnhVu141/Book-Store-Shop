import { InboxOutlined } from "@ant-design/icons";
import { message, Modal, Table, Upload } from "antd";
import type { UploadProps } from 'antd';
import { useState } from "react";
import Exceljs from 'exceljs';
import { Buffer } from "buffer";
import { exportFileExcel, uploadFileExcel } from "@/services/api";
import { saveAs } from 'file-saver';


interface IProp {
    openImportUser: boolean;
    setImportUser: (v: boolean) => void;
    refreshTable: () => void;
}

interface IDataImport {
    name: string;
    email: string;
    password: string;
    role: string;
}


const ImportUser = (props: IProp) => {

    const { openImportUser, setImportUser, refreshTable } = props;
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
                    await handleReadFile(file);
                    messageApi.open({
                        type: 'success',
                        content: `Đọc file ${info.file.name} thành công`,
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

    const handleReadFile = async (file: any) => {
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

    const handleUploadFile = async () => {
        let data = [];

        // Duyệt qua dataImport và tạo mảng dữ liệu để gửi lên backend
        data = dataImport.map(item => ({
            ...item,
        }));

        try {
            const response = await uploadFileExcel(data);
            if (response && response.data) {
                console.log("check success: ", response.message);
                messageApi.open({
                    type: 'success',
                    content: "Import thành công"
                });
                refreshTable();
                setImportUser(false);
            }
            else {
                messageApi.open({
                    type: 'error',
                    content: response.message || "Email đã trùng trong hệ thống",
                });
                setImportUser(false);
            }
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: error.response ? error.response.data.message : "Đã có lỗi khi thực hiện",
            });
        }
        setDataImport([]);
    };


    return (
        <Modal
            title="Import dữ liệu Users"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={openImportUser}
            onOk={() => {
                handleUploadFile()
            }}
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
                <p className="ant-upload-text">Nhấn vào để thực hiện Upload file Excel</p>
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