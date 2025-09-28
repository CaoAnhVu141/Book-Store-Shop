import { Form, Image, Input, message, Modal, Select, Upload, type GetProp, type UploadFile, type UploadProps } from "antd";
import { useEffect, useState } from "react";
import type { FormProps } from "antd/lib";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { fetchAllCategory, fetchListAuthor, updateBook, uploadFileBook } from "@/services/api";

interface IProp {
    openUpdateBook: boolean;
    setOpenUpdateBook: (v: boolean) => void;
    dataUpdateBook: IBook | null;
    setDataUpdateBook: (v: IBook | null) => void;
}

type FieldType = {
    name: string;
    description: string;
    price: number;
    author: string;
    category: string;
    thumbnail: string;
    images: string[];
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const UpdateBook = (props: IProp) => {
    const { openUpdateBook, setOpenUpdateBook, dataUpdateBook, setDataUpdateBook } = props;

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const [dataCategory, setDataCategory] = useState<IBook[]>([]);
    const [dataAuthor, setDataAuthor] = useState<IAuthor[]>([]);

    // const urlThumbnail = `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdateBook?.thumbnail}`;
    // const urlImages = dataUpdateBook?.images.map(images =>
    //     `${import.meta.env.VITE_BACKEND_URL}/images/book/${images}`
    // ) || [];

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const [thumbnailLoading, setThumbnailLoading] = useState<boolean>(false);
    const [imagesLoading, setImagesLoading] = useState<boolean>(false);

    const [thumbnailFile, setThumbnailFile] = useState<UploadFile | null>(null);
    const [imageFiles, setImageFiles] = useState<UploadFile[]>([]);

    //save file name thubnail and images
    const [fileNameThumbnail, setFileThumbnail] = useState<string>('');
    const [fileNameImages, setFileImages] = useState<string[]>([]);


    useEffect(() => {
        if (dataUpdateBook) {
            form.setFieldsValue({
                _id: dataUpdateBook._id,
                name: dataUpdateBook.name,
                author: dataUpdateBook.author?._id,
                price: dataUpdateBook.price,
                category: dataUpdateBook.category,
                thumbnail: dataUpdateBook.thumbnail,
                images: dataUpdateBook.images,
                description: dataUpdateBook.description,
            });
            // Set thumbnail preview
            if (dataUpdateBook.thumbnail) {
                setThumbnailFile({
                    uid: '-1',
                    name: dataUpdateBook.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdateBook.thumbnail}`,
                });
            }

            // Set images preview
            if (dataUpdateBook.images && dataUpdateBook.images.length > 0) {
                const listImages = dataUpdateBook.images.map((image, index) => ({
                    uid: `-${index}`,
                    name: image,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${image}`,
                }));
                setFileImages(listImages);
            }
            setFileThumbnail(dataUpdateBook.thumbnail);
            setFileImages(dataUpdateBook.images);

        }
    }, [dataUpdateBook]);

    useEffect(() => {
        const fetchCategory = async () => {
            const response = await fetchAllCategory('');
            setDataCategory(response.data?.result);
        }
        const fetchAuthor = async () => {
            const response = await fetchListAuthor('');
            setDataAuthor(response.data?.result);
        }

        const fetchData = async () => {
            await Promise.all([fetchCategory(), fetchAuthor()]);
            setLoading(false);
        }
        fetchData();
    }, []);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {

        const { name, description, price, author, category } = values;

        console.log("check athor: ", author);

        const thumbnail = fileNameThumbnail;
        const images = fileNameImages;

        const formatPrice = parseFloat(price.toString());

        const response = await updateBook(dataUpdateBook?._id, name, description, formatPrice, author, category, thumbnail, images);
        if (response && response.data) {
            messageApi.open({
                type: 'success',
                content: 'Cập nhật thành công',
            });
            form.resetFields();
            setOpenUpdateBook(false);
            setDataUpdateBook(null);
        }
        else {
            messageApi.open({
                type: 'error',
                content: response.message,
            });
            setIsSubmit(false);
        }
    }

    const handleCanel = () => {
        setDataUpdateBook(null);
        setOpenUpdateBook(false);
    }

    const handleUploadThumbnail = async ({ file, onSuccess, onError }: any) => {
        setThumbnailLoading(true);
        try {
            const response = await uploadFileBook(file);
            if (response && response.data) {
                // Giả sử API trả về fileName trong response.data
                const fileName = response.data.fileName || response.data.name;
                setFileThumbnail(fileName);
                getBase64(file, (url: string) => {
                    setThumbnailFile({
                        uid: file.uid,
                        name: file.name,
                        status: 'done',
                        url: url,
                        thumbUrl: url
                    });

                    // Cập nhật form field
                    form.setFieldValue('thumbnail', fileName);
                    onSuccess('oke');
                    setThumbnailLoading(false);
                });
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            setThumbnailLoading(false);
            onError("Đã có lỗi khi thực hiện Upload");
            message.error('Upload thumbnail thất bại');
        }
    };

    const handleUploadImages = async ({ file, onSuccess, onError }: any) => {
        setImagesLoading(true);
        try {
            const response = await uploadFileBook(file);
            if (response && response.data) {
                const fileName = response.data.fileName || response.data.name;

                getBase64(file, (url: string) => {
                    const newFile: UploadFile = {
                        uid: file.uid,
                        name: file.name,
                        status: 'done',
                        url: url,
                        thumbUrl: url
                    };

                    setImageFiles(prev => [...prev, newFile]);

                    // save file name images array
                    setFileImages(prev => [...prev, fileName]);
                    form.setFieldValue('images', [...fileNameImages, fileName]);

                    onSuccess('ok');
                    setImagesLoading(false);
                });
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            setImagesLoading(false);
            onError("Đã có lỗi khi thực hiện Upload");
            message.error('Upload image thất bại');
        }
    }

    const getBase64 = (img: FileType, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
            return Upload.LIST_IGNORE;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
            return Upload.LIST_IGNORE;
        }
        return isJpgOrPng && isLt2M;
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await new Promise<string>((resolve) => {
                getBase64(file.originFileObj as FileType, resolve);
            });
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    }

    const handleRemoveImage = (file: UploadFile) => {
        setImageFiles(prev => prev.filter(f => f.uid !== file.uid));

        // Cập nhật form field
        const currentImages = form.getFieldValue('images') || [];
        const fileName = file.name; // Hoặc lấy từ metadata nếu có
        form.setFieldValue('images', currentImages.filter((img: string) => img !== fileName));

        return true;
    }

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {thumbnailLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <>
            {contextHolder}
            <Modal
                title="Cập nhật sách"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={openUpdateBook}
                width={"800px"}
                onOk={() => { form.submit() }}
                onCancel={handleCanel}
                confirmLoading={isSubmit}
            >
                <div style={{ display: "flex", left: "10px" }}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 700 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="Tên"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập sách!' }]}
                        >
                            <Input style={{
                                width: "350px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Mô tả"
                            name="description"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                        >
                            <TextArea rows={4} style={{
                                width: "480px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>
                        <Form.Item label="Danh mục" name="category">
                            <Select
                                loading={loading}
                                options={dataCategory.map(category => ({
                                    value: category._id,
                                    label: <span>{category.name}</span>
                                }))}
                            />
                        </Form.Item>
                        <Form.Item label="Tác giả" name="author" rules={[{ required: true, message: 'Vui lòng chọn tác giả' }]}>
                            <Select
                                loading={loading}
                                options={dataAuthor.map(author => ({
                                    value: author._id,
                                    label: <span>{author.name}</span>
                                }))}
                            />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Giá"
                            name="price"
                            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                        >
                            <Input style={{
                                width: "350px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Thumbnail"
                            name="thumbnail"
                            rules={[{ required: true, message: 'Vui lòng upload thumbnail' }]}
                        >
                            <Upload
                                name="thumbnail"
                                listType="picture-card"
                                className="thumbnail-uploader"
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                                customRequest={handleUploadThumbnail}
                            >
                                {thumbnailFile ? (
                                    <img
                                        draggable={false}
                                        src={thumbnailFile.url}
                                        alt="thumbnail"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            label="Images"
                            name="images"
                            rules={[{ required: true, message: 'Vui lòng upload ít nhất 1 image' }]}
                        >
                            <Upload
                                listType="picture-card"
                                fileList={imageFiles}
                                onPreview={handlePreview}
                                beforeUpload={beforeUpload}
                                customRequest={handleUploadImages}
                                onRemove={handleRemoveImage}
                                multiple
                            >
                                {imageFiles.length >= 4 ? null : (
                                    <button style={{ border: 0, background: 'none' }} type="button">
                                        {imagesLoading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </button>
                                )}
                            </Upload>
                        </Form.Item>

                        {previewImage && (
                            <Image
                                wrapperStyle={{ display: 'none' }}
                                preview={{
                                    visible: previewOpen,
                                    onVisibleChange: (visible) => setPreviewOpen(visible),
                                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                }}
                                src={previewImage}
                            />
                        )}
                    </Form>
                </div>
            </Modal>
        </>
    )
}
export default UpdateBook;