import { ProTable, type ActionType, type ProColumns } from "@ant-design/pro-components";
import { Button, DatePicker, message, Popconfirm } from "antd";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined, ImportOutlined, PlusOutlined } from "@ant-design/icons";
import { deleteWareHouse, fetchListWareHouse } from "@/services/api";
import CreateWareHouse from "./create.warehouse";

const TableWareHouse = () => {

    const actionRef = useRef<ActionType>();

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });


    type TSearch = {
        code: string;
        name: string,
        discounType: string,
        discounValue: number,
        status: boolean,
        startDate: string,
        endDate: string,
    };

    const [messageApi, contextHolder] = message.useMessage();

    const [openCreateWareHouse, setOpenCreateWareHouse] = useState<boolean>(false);

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
                        href="#">{entity._id}</a>
                )
            },
        },
        {
            disable: true,
            title: 'Tên',
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
            dataIndex: 'description',
            filters: true,
            onFilter: true,
            ellipsis: true,
            copyable: true,
            search: true,
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
                            description="Bạn có muốn xoá coupon này"
                            onConfirm={async () => {
                                handleDelete(record._id);
                            }}
                            // onCancel={cancel}
                            okText="Xác nhận"
                            cancelText="No"
                        >
                            <DeleteOutlined style={{ cursor: 'pointer', color: '#f00505' }} />
                        </Popconfirm>
                        <EditOutlined style={{ cursor: 'pointer', color: '#f2df07' }}
                        // onClick={async () => {
                        //     const response = await fetchCouponById(record._id);
                        //     setDataUpdateCoupon(response.data);
                        //     setOpenUpdateCoupon(true)
                        // }}
                        />
                    </div>
                </>
            ),
            filters: true,
        },
    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    const handleDelete = async (id: string) => {
        const response = await deleteWareHouse(id);
        if(response && response.data){
            messageApi.open({
                type: 'success',
                content: 'Xoá thành công',
            });
            refreshTable();
        }
        else{
            messageApi.open({
                type: 'error',
                content: response.message,
            });
        }
    }

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
                    if (params?.code) {
                        query += `&code=${params.code}`;
                    }
                    if (params?.name) {
                        query += `&name=${params.name}`;
                    }
                    if (params?.discounType) {
                        query += `&discounType=${params.discounType}`;
                    }


                    // filter date and name ascend descend =======
                    const sortFields: string[] = [];
                    for (const key in sort) {
                        if (sort[key] === 'ascend') sortFields.push(key);
                        if (sort[key] === 'descend') sortFields.push(`-${key}`);
                    }
                    if (sortFields.length > 0) {
                        query += `&sort=${sortFields.join(',')}`;
                    }

                    const response = await fetchListWareHouse(query);
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
                headerTitle="Danh sách"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        style={{ backgroundColor: '#7d7dfaff' }}
                        onClick={() => {
                            setOpenCreateWareHouse(true);
                        }}
                        type="primary">
                        Thêm mới
                    </Button>,
                    <Button
                        key="button"
                        icon={<ImportOutlined />}
                        style={{ backgroundColor: '#7d7dfaff' }}
                        type="primary">
                        Import
                    </Button>,
                    <Button
                        key="button"
                        icon={<ImportOutlined />}
                        style={{ backgroundColor: '#7d7dfaff' }}
                        type="primary">
                        Export
                    </Button>
                ]}
            />
            <CreateWareHouse
            openCreateWareHouse={openCreateWareHouse}
            setOpenCreateWareHouse={setOpenCreateWareHouse}
            refreshTable={refreshTable}
            />
        </>
    )
}
export default TableWareHouse;