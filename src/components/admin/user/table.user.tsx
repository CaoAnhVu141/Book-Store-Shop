import { fetchListUser } from '@/services/api';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, DatePicker, Space, Tag } from 'antd';
import { useRef, useState } from 'react';
import './table.user.css';
import moment from 'moment';
import dayjs from 'dayjs';


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

    type TSearch = {
        name: string,
        email: string,
        startDate: string,
        endDate: string,
    };
    return (
        <>
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

                    if(params.startDate || params.endDate){
                        query += `&startDate=${params.startDate}&endDate=${params.endDate}`;
                    }
                    
                    // filter date and name ascend descend
                    const sortFields: string[] = [];
                    for(const key in sort){
                        if(sort[key] === 'ascend') sortFields.push(key);
                        if(sort[key] === 'descend') sortFields.push(`-${key}`);
                    }
                    if(sortFields.length > 0){
                        query += `&sort=${sortFields.join(',')}`;
                    }

                    const response = await fetchListUser(query);
                    if (response.data) {
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