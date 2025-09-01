import { deteleUser, fetchListUser, fetchUserById } from '@/services/api';
import { DeleteOutlined, EditOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, DatePicker, message, Popconfirm, Space, Tag } from 'antd';
import { useRef, useState } from 'react';
import './table.user.css';
import dayjs from 'dayjs';
import UserDetail from './user.detail';
import CreateUser from './create.user';
import ImportUser from './import.user';
import { exportFileExcel } from "@/services/api";
import { saveAs } from 'file-saver';


const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });  // quản lý pagination

    type TSearch = {
        name: string,
        email: string,
        startDate: string,
        endDate: string,
    };

    const [dataDetailUser, setDataDetailUser] = useState<boolean>(false);
    const [openDetailUser, setOpenDetailUser] = useState<IUser | null>(null);

    const [openCreateUser, setOpenCreateUser] = useState<boolean>(false);

    const [messageApi, contextHolder] = message.useMessage();

    // thực thi khai báo truyền import user
    const [openImportUser, setImportUser] = useState<boolean>(false);

    //lấy data table hiện tại
    const [currentData, setCurrentData] = useState<IUser[]>([]);


    const columns: ProColumns<IModelPaginate>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'ID',
            dataIndex: '_id',
            copyable: true,
            ellipsis: true,
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a
                        onClick={async () => {
                            const response = await fetchUserById(entity._id);
                            setDataDetailUser(response.data);
                            setOpenDetailUser(true);
                        }}
                        href="#">{entity._id}</a>
                )
            },
        },
        {
            disable: true,
            title: 'Email',
            dataIndex: 'email',
            filters: true,
            onFilter: true,
            ellipsis: true,
            copyable: true,
            search: true,
        },
        {
            disable: true,
            title: 'Name',
            dataIndex: 'name',
            filters: true,
            onFilter: true,
            ellipsis: true,
            copyable: true,
            search: true,
            sorter: true,
        },
        {
            disable: true,
            title: 'Created At',
            dataIndex: 'createdAt',
            filters: true,
            sorter: true,
            valueType: 'date',
            render: (_, record) => dayjs(record.createdAt).format('DD/MM/YYYY'),
            renderFormItem: () => <DatePicker.RangePicker format="DD/MM/YYYY" />,
            search: {
                transform: (value) => ({
                    startDate: dayjs(value[0]).format('YYYY-MM-DD'),
                    endDate: dayjs(value[1]).format('YYYY-MM-DD'),
                }),
            },
        },
        {
            disable: true,
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => (
                <>
                    <div className='action-module'>
                        <Popconfirm
                            title="Xoá user"
                            description="Bạn có muốn xoá user này"
                            onConfirm={() => {
                                handleDeleteUser(record._id)
                            }}
                            // onCancel={cancel}
                            okText="Xác nhận"
                            cancelText="No"
                        >
                            <DeleteOutlined style={{ cursor: 'pointer', color: '#f00505' }} />
                        </Popconfirm>
                        <EditOutlined style={{ cursor: 'pointer', color: '#f2df07' }} />

                    </div>
                </>
            ),
            filters: true,
        },
    ];

    // refresh sau khi tạo mới
    const refreshTable = () => {
        actionRef.current?.reload();
    }

    const handleDeleteUser = async (id: string) => {
        const response = await deteleUser(id);
        if (response && response.data) {
            messageApi.open({
                type: 'success',
                content: 'Xoá thành công',
            });
            refreshTable();
        }
        else {
            messageApi.open({
                type: 'error',
                content: response.message,
            });
        }
    }

    const handleExportFileExcel = async () => {
        try {
            console.log("check currentData: ", response);
            const response = await exportFileExcel(currentData);
            if (response) {
                messageApi.open({
                    type: 'success',
                    content: "Export file thành công"
                });
                saveAs(response, 'users.csv');
                refreshTable();
            } else {
                messageApi.open({
                    type: 'error',
                    content: "Export chưa thành công",
                });
            }
        } catch (error: any) {
            messageApi.open({
                type: 'error',
                content: error.response ? error.response.data.message : "Đã có lỗi khi thực hiện",
            });
        }
    }

    return (
        <>
            {contextHolder}
            <ProTable<IModelPaginate, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                    }
                    if (params?.email) {
                        query += `&email=${params.email}`;
                    }
                    if (params?.name) {
                        query += `&name=${params.name}`;
                    }

                    if (params.startDate || params.endDate) {
                        query += `&startDate=${params.startDate}&endDate=${params.endDate}`;
                    }

                    // filter date and name ascend descend
                    const sortFields: string[] = [];
                    for (const key in sort) {
                        if (sort[key] === 'ascend') sortFields.push(key);
                        if (sort[key] === 'descend') sortFields.push(`-${key}`);
                    }
                    if (sortFields.length > 0) {
                        query += `&sort=${sortFields.join(',')}`;
                    }

                    const response = await fetchListUser(query);
                    if (response.data) {
                        console.log("check response.data: ", response.data);
                        setMeta(response.data.meta);
                        setCurrentData(response.data?.result ?? []);
                    }
                    return {
                        data: response.data?.result,
                        page: 1,
                        success: true,
                        total: response.data?.meta.total
                    }
                }}
                editable={{
                    type: 'multiple',
                }}
                columnsState={{
                    persistenceKey: 'pro-table-singe-demos',
                    persistenceType: 'localStorage',
                    defaultValue: {
                        option: { fixed: 'right', disable: true },
                    },
                    onChange(value) {
                        console.log('value: ', value);
                    },
                }}
                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    // showSizeChanger: true,
                    total: meta.total,
                }}
                headerTitle="Table user"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenCreateUser(true);
                        }}
                        type="primary">
                        Thêm mới
                    </Button>,
                    <Button
                        key="button"
                        icon={<ImportOutlined />}
                        onClick={() => {
                            setImportUser(true);
                        }}
                        type="primary">
                        Import
                    </Button>,
                    <Button
                        key="button"
                        icon={<ImportOutlined />}
                        onClick={() => {
                            
                            handleExportFileExcel(currentData);
                        }}
                        type="primary">
                        Export
                    </Button>
                ]}
            />
            <UserDetail
                dataDetailUser={dataDetailUser}
                setDataDetailUser={setDataDetailUser}
                openDetailUser={openDetailUser}
                setOpenDetailUser={setOpenDetailUser}
            />
            <CreateUser
                openCreateUser={openCreateUser}
                setOpenCreateUser={setOpenCreateUser}
                refreshTable={refreshTable}
            />
            <ImportUser
                openImportUser={openImportUser}
                setImportUser={setImportUser}
                refreshTable={refreshTable}
            />
        </>
    );
};

export default TableUser;