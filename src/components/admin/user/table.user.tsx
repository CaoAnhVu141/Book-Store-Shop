import { fetchListUser } from '@/services/api';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import { useRef, useState } from 'react';
import './table.user.css';
import moment from 'moment';


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
                <a href="#">{entity._id}</a>
            )
        },
    },
    {
        disable: true,
        title: 'Email',
        dataIndex: 'email',
        filters: true,
        // onFilter: true,
        ellipsis: true,
        copyable: true,
        valueType: 'select',
    },
    {
        disable: true,
        title: 'Name',
        dataIndex: 'name',
        filters: true,
        onFilter: true,
        ellipsis: true,
        copyable: true,
        valueType: 'select',
    },
    {
        disable: true,
        title: 'Created At',
        dataIndex: 'createdAt',
        filters: true,
        render: (record) => {
            return (
                <div>
                    <p>{moment(record.createdAt).format("DD-MM-YYYY")}</p>
                </div>
            );
        },
        // onFilter: true,
        valueType: 'select',
    },
    {
        disable: true,
        title: 'Action',
        dataIndex: 'action',
        render: (_, record) => (
            <>
                <div className='action-module'>
                    <EditOutlined style={{ cursor: 'pointer', color: '#f2df07' }} />
                    <DeleteOutlined style={{ cursor: 'pointer', color: '#f00505' }} />
                </div>
            </>
        ),
        filters: true,
    },
];

const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });  // quản lý pagination
    return (
        <>
            <ProTable<IModelPaginate>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log("check current: ", params.current);
                    console.log("check pageSize: ", params.pageSize);
                    const response = await fetchListUser(params?.current ?? 1, params?.pageSize ?? 5);
                    if(response.data){
                        setMeta(response.data.meta);
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
                            actionRef.current?.reload();
                        }}
                        type="primary">
                        Add new
                    </Button>
                ]}
            />
        </>
    );
};

export default TableUser;