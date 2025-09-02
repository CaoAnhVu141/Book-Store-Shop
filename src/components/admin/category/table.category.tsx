import { DeleteOutlined, EditOutlined, ImportOutlined, PlusOutlined } from "@ant-design/icons";
import { ProTable, type ProColumns } from "@ant-design/pro-components";
import { Button, DatePicker } from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";

const TableCategory = () => {
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
                    // <a
                    //     onClick={async () => {
                    //         const response = await fetchUserById(entity._id);
                    //         setDataDetailUser(response.data);
                    //         setOpenDetailUser(true);
                    //     }}
                    //     href="#">{entity._id}</a>
                    <>
                    </>
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
            dataIndex: 'description',
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
                            // onConfirm={() => {
                            //     handleDeleteUser(record._id);
                            // }}
                            // onCancel={cancel}
                            okText="Xác nhận"
                            cancelText="No"
                        >
                            <DeleteOutlined style={{ cursor: 'pointer', color: '#f00505' }} />
                        </Popconfirm>
                        {/* <EditOutlined style={{ cursor: 'pointer', color: '#f2df07' }} onClick={async () => {
                            const response = await fetchDataUpdateUserById(record._id);
                            setDataUpdateUser(response.data); setOpenUpdateUser(true) }}/> */}
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
                headerTitle="Table user"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        // onClick={() => {
                        //     setOpenCreateUser(true);
                        // }}
                        type="primary">
                        Thêm mới
                    </Button>,
                    <Button
                        key="button"
                        icon={<ImportOutlined />}
                        // onClick={() => {
                        //     setImportUser(true);
                        // }}
                        type="primary">
                        Import
                    </Button>,
                    <Button
                        key="button"
                        icon={<ImportOutlined />}
                        // onClick={() => {
                        //     handleExportFileExcel();
                        // }}
                        type="primary">
                        Export
                    </Button>
                ]}

            />


        </>
    )


}
export default TableCategory;