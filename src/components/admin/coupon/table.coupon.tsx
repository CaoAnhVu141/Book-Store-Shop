import { deleteCoupon, fetchCouponById, fetchListCoupon } from "@/services/api";
import { DeleteOutlined, EditOutlined, ImportOutlined, PlusOutlined } from "@ant-design/icons";
import { ProTable, type ActionType, type ProColumns } from "@ant-design/pro-components";
import { Button, DatePicker, message, Popconfirm } from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import DetailCoupon from "./detail.coupon";
import CreateCoupon from "./create.coupon";

const TableCoupon = () => {


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

    const [messageApi, contextHolder] = message.useMessage();

    const [openDetailCoupon, setOpenDetailCoupon] = useState<boolean>(false);
    const [dataDetailCoupon, setDataDetailCoupon] = useState<ICoupon | null>(null);

    const [openCreateCoupon, setOpenCreateCoupon] = useState<boolean>(false);


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
                            const response = await fetchCouponById(entity._id);
                            setOpenDetailCoupon(true);
                            setDataDetailCoupon(response.data);
                        }}
                        href="#">{entity._id}</a>
                )
            },
        },
        {
            disable: true,
            title: 'Mã code',
            dataIndex: 'code',
            filters: true,
            onFilter: true,
            ellipsis: true,
            copyable: true,
            search: true,

        },
        {
            disable: true,
            title: 'Giảm giá',
            dataIndex: 'name',
            filters: true,
            onFilter: true,
            ellipsis: true,
            copyable: true,
            search: true,
        },
        {
            disable: true,
            title: 'Loại giảm giá',
            dataIndex: 'discounType',
            filters: true,
            onFilter: true,
            ellipsis: true,
            copyable: true,
            search: true,
            sorter: true,
            hideInSearch: true,
        },
        {
            disable: true,
            title: 'Bắt đầu',
            dataIndex: 'startDate',
            filters: true,
            onFilter: true,
            ellipsis: true,
            copyable: true,
            search: true,
            sorter: true,
            valueType: 'date',
            render: (_, record) => dayjs(record.createdAt).format("DD/MM/YYYY HH:mm"),
            renderFormItem: () => <DatePicker.RangePicker format="DD/MM/YYYY HH:mm" />,
        },
        {
            disable: true,
            title: 'Kết thúc',
            dataIndex: 'endDate',
            filters: true,
            onFilter: true,
            ellipsis: true,
            copyable: true,
            search: true,
            sorter: true,
            valueType: 'date',
            render: (_, record) => dayjs(record.createdAt).format("DD/MM/YYYY HH:mm"),
            renderFormItem: () => <DatePicker.RangePicker format="DD/MM/YYYY HH:mm" />,
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
                            onConfirm={() => {
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
                        //     const response = await fetchCategoryById(record._id);
                        //     setDataUpdateCategory(response.data); setOpenUpdateCategory(true) }}
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

    const handleDelete = async (_id: string) => {
        const response = await deleteCoupon(_id);
        if (response && response.data) {
            messageApi.open({
                type: 'success',
                content: 'Xoá thành công',
            });
            refreshTable();
        }
        else {
            messageApi.open({
                type: 'success',
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


                    // filter date and name ascend descend =======
                    const sortFields: string[] = [];
                    for (const key in sort) {
                        if (sort[key] === 'ascend') sortFields.push(key);
                        if (sort[key] === 'descend') sortFields.push(`-${key}`);
                    }
                    if (sortFields.length > 0) {
                        query += `&sort=${sortFields.join(',')}`;
                    }

                    const response = await fetchListCoupon(query);
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
                            setOpenCreateCoupon(true);
                        }}
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
            <DetailCoupon
                openDetailCoupon={openDetailCoupon}
                setOpenDetailCoupon={setOpenDetailCoupon}
                dataDetailCoupon={dataDetailCoupon}
                setDataDetailCoupon={setDataDetailCoupon}
            />
            <CreateCoupon
                openCreateCoupon={openCreateCoupon}
                setOpenCreateCoupon={setOpenCreateCoupon}
                refreshTable={refreshTable}
            />

        </>
    )
}
export default TableCoupon;