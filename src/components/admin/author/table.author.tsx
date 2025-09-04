import { fetchListAuthor } from "@/services/api";
import { DeleteOutlined, EditOutlined, ImportOutlined, PlusOutlined } from "@ant-design/icons";
import { ProTable, type ProColumns } from "@ant-design/pro-components";
import { Button, DatePicker, Popconfirm } from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";


const TableAuthor = () => {

    const actionRef = useRef<ActionType>();

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });


     type TSearch = {
        name: string,
        bio: string,
        startDate: string,
        endDate: string,
    };

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
                        // onClick={async () => {
                        //     const response = await fetchCategoryById(entity._id);
                        //     setDataDetailCategory(response.data);
                        //     setOpenDetailCategory(true);
                        // }}
                        href="#">{entity._id}</a>
                )
            },
        },
        {
            disable: true,
            title: 'Danh mục',
            dataIndex: 'name',
            filters: true,
            onFilter: true,
            ellipsis: true,
            copyable: true,
            search: true,
        },
        {
            disable: true,
            title: 'Mô tả',
            dataIndex: 'bio',
            filters: true,
            onFilter: true,
            ellipsis: true,
            copyable: true,
            search: true,
            sorter: true,
        },
        {
            disable: true,
            title: 'Ngày tạo',
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
            title: 'Hành động',
            dataIndex: 'action',
            render: (_, record) => (
                <>
                    <div className='action-module'>
                        <Popconfirm
                            title="Xoá user"
                            description="Bạn có muốn xoá user này"
                            onConfirm={() => {
                                // handleDeleteCategory(record._id);
                            }}
                            // onCancel={cancel}
                            okText="Xác nhận"
                            cancelText="No"
                        >
                            <DeleteOutlined style={{ cursor: 'pointer', color: '#f00505' }} />
                        </Popconfirm>
                        <EditOutlined style={{ cursor: 'pointer', color: '#f2df07' }}
                        // onClick={async () => {
                        //     const response = await fetchCategoryById(record._id);
                        //     setDataUpdateCategory(response.data); setOpenUpdateCategory(true) }}
                        />
                    </div>
                </>
            ),
            filters: true,
        },
    ];
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
                    if (params?.name) {
                        query += `&name=${params.name}`;
                    }
                    if (params?.bio) {
                        query += `&description=${params.bio}`;
                    }
                    if (params?.startDate || params?.endDate) {
                        query += `&startDate=${params.startDate}&endDate=${params.endDate}`;
                    }
                    const response = await fetchListAuthor(query);
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
                        type="primary">
                        Thêm mới
                    </Button>,
                    <Button
                        key="button"
                        icon={<ImportOutlined />}

                        type="primary">
                        Import
                    </Button>,
                    <Button
                        key="button"
                        icon={<ImportOutlined />}

                        type="primary">
                        Export
                    </Button>
                ]}
            />
        </>
    )
}

export default TableAuthor;