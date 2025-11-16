import { Card, Form, Upload, message } from 'antd';
import React, { useState } from 'react';
import { FaFileExcel } from 'react-icons/fa';
import { HiSpeakerWave } from 'react-icons/hi2';
import { FaRegImage } from "react-icons/fa6";
import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from "xlsx";
import { extractData, readExcelFile, saveMultipleFiles } from '../../slice/files';
import { checkType } from '../../utils/checkType';

const UploadDragger = ({ type, testTitle, mediaUrl, form, typeUpload }) => {
    const dispatch = useDispatch();
    const [fileList, setFileList] = useState([]);
    const { excelData, questionList, answerList, error, uploadedFiles, loading } = useSelector((state) => state.file);

    const getFileTypeName = (type) => {
        switch (type) {
            case "Excel":
                return "File câu hỏi Excel";
            case "LISTENING_AUDIO":
                return "File âm thanh toàn đề";
            case "QUESTION_AUDIO":
                return "File âm thanh câu hỏi";
            case "QUESTION_IMAGE":
                return "File hình ảnh";
            default:
                return "File";
        }
    };

    const beforeUploadExcel = (file) => {
        dispatch(readExcelFile(file))
            .unwrap()
            .then(() => {
                dispatch(extractData({ testTitle: testTitle, mediaUrl: mediaUrl }));
                toast.success(`${file.name} đã được xử lý thành công!`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            })
            .catch((err) => {
                toast.error(`Lỗi khi xử lý file Excel: ${err.message || 'Vui lòng thử lại'}`, {
                    position: "top-right",
                    autoClose: 4000,
                });
            });
        return false;
    }

    const handleUploadResourceContent = (options) => {
        const { file, onSuccess, onError } = options;
        const newFiles = [...fileList, file];
        setFileList(newFiles);

        if (!form.getFieldValue("title")) {
            toast.error("Vui lòng nhập Tên bài thi trước khi upload!", {
                position: "top-right",
                autoClose: 3000,
            });
            onError("Missing test title");
            return;
        }

        dispatch(saveMultipleFiles({ files: newFiles, testTitle: form.getFieldValue("title"), fileCategory: type },
            { dispatch: dispatch }))
            .unwrap()
            .then(() => {
                onSuccess("ok");
                const fileTypeName = getFileTypeName(type);
                toast.success(`${fileTypeName} đã được tải lên thành công!`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            })
            .catch(err => {
                onError(err);
                toast.error(`Lỗi khi tải lên: ${err.message || 'Vui lòng thử lại'}`, {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            });
    };

    console.log("file uploaded:", uploadedFiles)

    return (
        <Card className="uploadFrame">
            <Upload.Dragger
                fileList={fileList}
                onRemove={(file) => {
                    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
                    toast.info(`Đã xóa file: ${file.name}`, {
                        position: "top-right",
                        autoClose: 2000,
                    });
                }}
                itemRender={(originNode, file) => {
                    // Custom render for file list items
                    return (
                        <div className="ant-upload-list-item">
                            {originNode}
                        </div>
                    );
                }}
                customRequest={handleUploadResourceContent}
                multiple={type === "Excel" || type === "LISTENING_AUDIO" ? false : true}
                accept={type === "Excel" ? ".xls,.xlsx" : type === "LISTENING_AUDIO" || type === "QUESTION_AUDIO" ? ".mp3, .wav, .m4a" : ".png, .webp, .jpg, .jpeg"}
                beforeUpload={type === "Excel" && beforeUploadExcel}
                showUploadList={true}
                className="!h-64 w-full !flex !flex-col !justify-center !items-center"
            >
                <p
                    className={`ant-upload-drag-icon w-24 h-24 !flex !items-center !justify-center p-4 ${type === "Excel" ? "bg-green-100" : type === "LISTENING_AUDIO" || type === "QUESTION_AUDIO" ? "bg-blue-100" : "bg-orange-100"} rounded-[50%]`}
                >
                    {type === "Excel"
                        ? <FaFileExcel className='text-green-600 text-4xl' />
                        : type === "LISTENING_AUDIO" || type === "QUESTION_AUDIO"
                            ? <HiSpeakerWave className='text-blue-600 text-4xl' />
                            : <FaRegImage className='text-orange-900 text-4xl' />
                    }
                </p>
                <p className='text-xl font-[400]'>Kéo thả file vào đây</p>
                <span>hoặc <span className='text-blue-400'>chọn file</span></span>
                <p className="text-gray-400 text-xs mt-2">
                    {type === "Excel"
                        ? <>Hỗ trợ .xlsx, .xls (tối đa 10MB)</>
                        : type === "LISTENING_AUDIO" || type === "QUESTION_AUDIO"
                            ? <>Hỗ trợ .mp3, .wav, .m4a (tối đa 50MB)</>
                            : <>Hỗ trợ .png, .jpg, .jpeg, webp (tối đa 50MB)</>}
                </p>
            </Upload.Dragger>
        </Card>
    );
};

export default UploadDragger;