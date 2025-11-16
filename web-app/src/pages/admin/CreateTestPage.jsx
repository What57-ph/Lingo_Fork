import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Progress, Select, Upload, Spin } from 'antd';
import {
    UploadOutlined,
    EyeOutlined,
    SaveOutlined,
    CheckCircleOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import TextArea from 'antd/es/input/TextArea';
import { FaFileExcel } from "react-icons/fa";
import { HiSpeakerWave } from "react-icons/hi2";
import UploadDragger from '../../components/admin/UploadDragger';
import { useDispatch, useSelector } from "react-redux";
import { createTest } from '../../slice/tests';
import { saveMultipleQuestions } from '../../slice/questions';
import { useWatch } from 'antd/es/form/Form';
import { FaRegImage } from 'react-icons/fa6';
import _ from "lodash";

const CreateTestPage = () => {
    const initialTestState = {
        id: null,
        title: "",
        type: "",
        timeLimit: null,
        numberQuestion: 0,
        maxScore: 0,
        description: "",
        mediaUrl: ""
    };
    const [test, setTest] = useState(initialTestState);
    const [questionSample, setQuestionSample] = useState();
    const [submitted, setSubmitted] = useState(false);
    const [typeUpload, setTypeUpload] = useState();
    const [groupedUploadedFiles, setGroupedUploadedFiles] = useState();
    const { questionList, answerList, uploadPercent, uploadedFiles, loading } = useSelector((state) => state.file);
    const questionGroupedByPart = _.groupBy(questionSample, "part")

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const testTitle = useWatch("title", form);
    const mediaUrl = useWatch("mediaUrl", form);

    const onFinish = (values) => {
        const payload = {
            ...values,
            timeLimit: values.timeLimit * 60,
            numberQuestion: questionList.length
        };
        console.log("BasicInfoValues:", values);
        dispatch(createTest(values))
            .unwrap()
            .then(data => {
                setTest(data);
                setSubmitted(true);

                dispatch(saveMultipleQuestions(questionSample));
                console.log("debug when upload:", questionSample)
            });

    };

    const newTest = () => {
        setTest(initialTestState);
        setSubmitted(false);
    }

    useEffect(() => {
        setQuestionSample(questionList);
    }, [questionList])

    useEffect(() => {
        const grouped = _.groupBy(uploadedFiles.flat(), "fileCategory")
        setGroupedUploadedFiles(grouped);
        if (grouped["LISTENING_AUDIO"]) {
            console.log("debug test audio:", grouped["LISTENING_AUDIO"])
            form.setFieldsValue({
                mediaUrl: grouped["LISTENING_AUDIO"]?.[0]?.mediaUrl
            });

        }
        if (typeUpload === "Part" && grouped["QUESTION_AUDIO"]) {
            const audioFiles = grouped["QUESTION_AUDIO"];

            setQuestionSample(prevQuestions =>
                prevQuestions.map(q => {
                    const matchedAudio = audioFiles.find(item => {
                        const part = item.mediaUrl
                            .split("/")
                            .pop()
                            .match(/(?:PART|SECTION)[_ ]?(\d+)/i)?.[1];
                        return (
                            parseInt(part, 10) ===
                            parseInt(q?.part?.replace(/\D/g, ""), 10)
                        );
                    });

                    return matchedAudio
                        ? { ...q, explanationResourceContent: matchedAudio.mediaUrl }
                        : q;
                })
            );
        }

        if (grouped["QUESTION_AUDIO"] && typeUpload === "Question") {
            setQuestionSample(prevQuestions =>
                prevQuestions.map(q => {
                    const matchedFile = grouped["QUESTION_AUDIO"].find(item => {
                        const questionNumber = item?.fileName?.split("/")[1].split("-")[3];
                        return (
                            questionNumber &&
                            parseInt(questionNumber?.split("_")[1]?.split(".")[0], 10) === q?.questionNumber
                        );
                    });

                    return matchedFile
                        ? { ...q, explanationResourceContent: matchedFile.mediaUrl }
                        : q;
                })
            );
        }

        if (grouped["QUESTION_IMAGE"]) {
            setQuestionSample(prevQuestions =>
                prevQuestions.map(q => {
                    const matchedFile = grouped["QUESTION_IMAGE"].find(item => {
                        const questionNumber = item?.fileName?.split("/")[1].split("-")[3];
                        if (!questionNumber) return false;

                        const parts = questionNumber.split(".")[0].split("_");
                        const questionNumberStart = parts[1];
                        const questionNumberEnd = parts[2];

                        if (questionNumberStart && questionNumberEnd) {
                            return (
                                q.questionNumber >= parseInt(questionNumberStart, 10) &&
                                q.questionNumber <= parseInt(questionNumberEnd, 10)
                            );
                        }

                        const num = parseInt(parts[1], 10);
                        return num === q?.questionNumber;
                    });

                    if (!matchedFile) return q;

                    return {
                        ...q,
                        resourceContent: matchedFile.mediaUrl,
                    };
                })
            );
        }

    }, [uploadedFiles, form])

    console.log("Questions upload sample", questionSample)

    return (
        <>
            <Spin
                spinning={loading}
                size="large"
                tip="Đang xử lý..."
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            >
                <Card className="p-6 shadow rounded-2xl">
                    <h2 className="text-2xl font-bold mb-1">Tạo bài thi mới</h2>
                    <p className="text-gray-500 mb-6">
                        Tạo và quản lý các bài thi IELTS, TOEIC một cách dễ dàng
                    </p>

                    <Form layout="vertical" form={form} onFinish={onFinish} encType={test.type === "Excel" ? "multipart/form-data" : ""}>
                        <div className="grid grid-cols-3 gap-4">
                            <Form.Item label="Tên bài thi" className="col-span-1" name="title">
                                <Input placeholder="Nhập tên bài thi..." className='!h-12' disabled={loading} />
                            </Form.Item>
                            <Form.Item label="Loại bài thi" className="col-span-1" name="type">
                                <Select placeholder="Chọn loại bài thi" className='!h-12' disabled={loading}>
                                    <Option value="IELTS">IELTS</Option>
                                    <Option value="TOEIC">TOEIC</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Dạng đề thi" className="col-span-1" name="category">
                                <Select placeholder="Chọn dạng đề thi" className='!h-12' disabled={loading}>
                                    <Option value="LISTENING">Listening</Option>
                                    <Option value="READING">Reading</Option>
                                    <Option value="SPEAKING">Speaking</Option>
                                    <Option value="Writing">Writing</Option>
                                </Select>
                            </Form.Item>
                        </div>

                        <div className="md:grid md:grid-cols-2 flex flex-wrap gap-6 my-6">
                            <div>
                                <p className="draggerTittle"><FaFileExcel className='text-green-600 text-lg' />File câu hỏi (Excel)
                                    <a
                                        href="/sample/upload.xlsx"
                                        download
                                        className="text-blue-600 underline hover:text-blue-800 text-sm"
                                    >
                                        Tải file mẫu
                                    </a></p>
                                <UploadDragger type={"Excel"}
                                    testTitle={testTitle}
                                    mediaUrl={mediaUrl} />
                            </div>
                            <Form.Item name="mediaUrl" hidden>
                                <Input />
                            </Form.Item>
                            <div>
                                <p className="draggerTittle">  <HiSpeakerWave className='text-blue-600 text-xl' />File âm thanh cho toàn đề thi (nếu có)</p>
                                <UploadDragger type={"LISTENING_AUDIO"} form={form} />
                            </div>
                            <div>
                                <div className='flex items-center lg:justify-between xl:flex-row flex-col'>
                                    <p className="draggerTittle">  <HiSpeakerWave className='text-blue-600 text-xl' />File âm thanh theo từng phần hoặc câu hỏi (nếu có)</p>
                                    <div className='flex gap-2 items-center mb-2'>
                                        <Button
                                            className={
                                                `!text-white !h-10 ` +
                                                (typeUpload === "Part"
                                                    ? "!bg-blue-800"
                                                    : "!bg-blue-400 hover:!bg-blue-600 hover:!text-black")
                                            }
                                            onClick={() => setTypeUpload("Part")}
                                            disabled={loading}
                                        >
                                            Từng phần
                                        </Button>

                                        <Button
                                            className={
                                                `!text-white !h-10 ` +
                                                (typeUpload === "Question"
                                                    ? "!bg-green-800"
                                                    : "!bg-green-400 hover:!bg-green-600 hover:!text-black")
                                            }
                                            onClick={() => setTypeUpload("Question")}
                                            disabled={loading}
                                        >
                                            Câu hỏi
                                        </Button>
                                    </div>
                                </div>
                                <UploadDragger type={"QUESTION_AUDIO"} form={form} typeUpload={typeUpload} />
                            </div>
                            <div>
                                <p className="draggerTittle flex items-center gap-1">
                                    <FaRegImage className='text-orange-900 text-xl' />
                                    File hình ảnh câu hỏi (nếu có)
                                </p>
                                <UploadDragger type={"QUESTION_IMAGE"} form={form} />
                                <p className="text-gray-500 text-sm mt-2 italic">
                                    *Lưu ý: Tên file ảnh phải theo đúng định dạng
                                    <strong> Tên đề thi-Phần câu hỏi-Số của câu hỏi</strong>.
                                    <br />
                                    Ví dụ: <strong>ETS 2024 Test 1-Part 1-Question 1</strong> cho câu 5 hoặc
                                    <strong>ETS 2024 Test 1-Part 3-Question 62_64</strong> cho các câu từ 62 đến 64.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <Form.Item label="Thời gian làm bài (phút)" name="timeLimit" initialValue={60}>
                                <Input className='!h-12' disabled={loading} />
                            </Form.Item>
                            <Form.Item label="Số câu hỏi" name="numOfQuestions" initialValue={40}>
                                <Input className='!h-12' disabled={loading} />
                            </Form.Item>
                            <Form.Item label="Điểm tối đa" name="maxScore" initialValue={100}>
                                <Input className='!h-12' disabled={loading} />
                            </Form.Item>
                        </div>

                        <Form.Item label="Mô tả bài thi" name="description">
                            <TextArea rows={4} placeholder="Nhập mô tả chi tiết về bài thi..." disabled={loading} />
                        </Form.Item>

                        <div className="flex justify-between gap-4 mt-6">
                            <Button
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                className='createBtn !bg-green-600 hover:!bg-green-800'
                                htmlType='submit'
                                loading={loading}
                                disabled={loading}
                            >
                                Tạo bài thi
                            </Button>
                        </div>
                    </Form>
                </Card>
            </Spin>

            <Card className="mt-6 p-4">
                <h3 className="text-lg font-semibold mb-3">Tiến độ tạo bài thi</h3>
                <div className="flex flex-col gap-2">
                    <Progress percent={100} format={() => "Thông tin cơ bản"} />
                    <Progress
                        percent={uploadPercent}
                        format={() => "Upload file câu hỏi"}
                        status={loading ? "active" : uploadPercent === 100 ? "success" : "normal"}
                    />
                    <Progress percent={33} format={() => "Hoàn thành và xuất bản"} />
                </div>
            </Card>
        </>
    );
};

export default CreateTestPage;