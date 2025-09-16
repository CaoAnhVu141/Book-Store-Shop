import { DeleteOutlined, EditOutlined, ImportOutlined, PlusOutlined } from "@ant-design/icons";
import { ProTable, type ActionType } from "@ant-design/pro-components";
import { Button, DatePicker, Image, message, Popconfirm } from "antd";
import { useRef, useState } from "react";
import dayjs from "dayjs";
import { deleteBook, fetchBookById, fetchListBook } from "@/services/api";
import DetailBook from "./detail.book";


const TableBook = () => {

    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });

    type TSearch = {
        name: string,
        description: string,
        startDate: string,
        endDate: string,
    };

    const [messageApi, contextHolder] = message.useMessage();

    const [openDetailBook, setOpenDetailBook] = useState<boolean>(false);
    const [dataDetailBook, setDataDetailBook] = useState<IBook | null>(null);

    const urlThumbnail = `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataDetailBook?.thumbnail}`;

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
                            const response = await fetchBookById(entity._id);
                            setOpenDetailBook(true);
                            setDataDetailBook(response.data);
                        }}
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
            search: true,
            sorter: true,
        },
        {
            disable: true,
            title: 'Giá',
            dataIndex: 'price',
            filters: true,
            onFilter: true,
            ellipsis: true,
            search: true,
            sorter: true,
        },
        {
            disable: true,
            title: 'Tác giả',
            // dataIndex: 'author',
            dataIndex: ['author', 'name'],
            filters: true,
            onFilter: true,
            ellipsis: true,
            search: true,
            sorter: true,
        },
        {
            disable: true,
            title: 'Thumbnail',
            dataIndex: "thumbnail",
            filters: true,
            onFilter: true,
            ellipsis: true,
            search: true,
            sorter: true,
            //     render: (text, record) => {
            //     const urlThumbnail = `${import.meta.env.VITE_BACKEND_URL}/images/book/${record.thumbnail}`;
            //     return <img src={urlThumbnail} alt="Thumbnail" style={{ width: 100, height: 100, objectFit: 'cover' }} />;
            // },
            render: (text, record) => {
                const urlThumbnail = `${import.meta.env.VITE_BACKEND_URL}/images/book/${record.thumbnail}`;
                return <Image width={100} src={urlThumbnail} alt="Thumbnail" preview={true} />
            }
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
                            description="Bạn có muốn xoá book này"
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
                        //     setDataUpdateCategory(response.data); setOpenUpdateCategory(true)
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

    const handleDelete = async (_id: string) => {
        const response = await deleteBook(_id);
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
                    // if (params?.name) {
                    //     query += `&name=${params.name}`;
                    // }
                    // if (params?.description) {
                    //     query += `&description=${params.description}`;
                    // }
                    // if (params?.startDate || params?.endDate) {
                    //     query += `&startDate=${params.startDate}&endDate=${params.endDate}`;
                    // }

                    // filter date and name ascend descend =======
                    const sortFields: string[] = [];
                    for (const key in sort) {
                        if (sort[key] === 'ascend') sortFields.push(key);
                        if (sort[key] === 'descend') sortFields.push(`-${key}`);
                    }
                    if (sortFields.length > 0) {
                        query += `&sort=${sortFields.join(',')}`;
                    }

                    const response = await fetchListBook(query);
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
                        // onClick={() => {
                        //     setOpenCreateCategory(true);
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
            <DetailBook
                openDetailBook={openDetailBook}
                setOpenDetailBook={setOpenDetailBook}
                dataDetailBook={dataDetailBook}
                setDataDetailBook={setDataDetailBook}
            />
        </>
    )
}
export default TableBook;