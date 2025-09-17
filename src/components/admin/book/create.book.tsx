import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, message, Modal, Upload, Image, type UploadFile, type UploadProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { GetProp } from "antd/lib";
import { useState } from "react";

interface IProp {
    openCreateBook: boolean;
    setOpenCreateBook: (v: boolean) => void;
    refreshTable: () => void;
}
type FieldType = {
    name: string,
    bio: string,
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const CreateBook = (props: IProp) => {

    const { openCreateBook, setOpenCreateBook, refreshTable } = props;
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const [thumbnailLoading, setThumbnailLoading] = useState<boolean>(false);
    const [urlThumbnal, setUrlThumbnail] = useState<string>();

    const [listImages, setListImages] = useState<UploadFile[]>([]);

    const handleCanel = () => {
        setOpenCreateBook(false);
    }

    const handleChangeThubnail = info => {
        if (info.file.status === 'uploading') {
            setThumbnailLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, url => {
                setThumbnailLoading(false);
                setUrlThumbnail(url);
            });
        }
        if (info.file.originFileObj && info.file.status !== 'uploading') {
            setThumbnailLoading(true);
            getBase64(info.file.originFileObj, (url: string) => {
                setThumbnailLoading(false);
                setUrlThumbnail(url);
            });
        }
    };

    const getBase64 = (img: FileType, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    // check image before upload file
    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    //function change listImage
    const handleImagesChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        setListImages(newFileList);
    };

    //function handle preview
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType, (url: string) => url); file.preview = await new Promise<string>((resolve) => {
                getBase64(file.originFileObj as FileType, resolve);
            });
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
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
                title="Tạo mới sách"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={openCreateBook}
                width={"800px"}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    handleCanel();
                    form.resetFields();
                }}
                confirmLoading={isSubmit}
            >
                <div style={{ display: "flex", left: "10px" }}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        // onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="Tác giả"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tác giả!' }]}
                        >
                            <Input style={{
                                width: "250px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="Bio"
                            name="bio"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                        >
                            <TextArea rows={4} style={{
                                width: "320px",
                                padding: "5px 5px"
                            }} />
                        </Form.Item>
                        <Form.Item label="Thumbnail">
                            <Upload
                                name="thumbnail"
                                listType="picture-card"
                                className="thumbnail-uploader"
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                                onChange={handleChangeThubnail}
                            >
                                {urlThumbnal ? (
                                    <img draggable={false} src={urlThumbnal} alt="thumbnail" style={{ width: '100%' }} />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                        </Form.Item>

                        {/* Images Upload - Multiple files */}
                        <Form.Item label="Images">
                            <Upload
                                listType="picture-card"
                                fileList={listImages}
                                onPreview={handlePreview}
                                onChange={handleImagesChange}
                                beforeUpload={beforeUpload}
                                multiple
                            >
                                {listImages.length >= 4 ? null : (
                                    <button style={{ border: 0, background: 'none' }} type="button">
                                        <PlusOutlined />
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
export default CreateBook;