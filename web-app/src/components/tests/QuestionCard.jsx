import React, { useEffect, useState } from "react";
import { Button, Card, Form, Image, Input, Radio, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "antd/es/form/Form";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import QuillBetterTable from "quill-better-table";
import "quill-better-table/dist/quill-better-table.css";
import { FaUpload } from "react-icons/fa";

import { checkType } from "../../utils/checkType";
import { getUserAnswers, modifyQuestion } from "../../slice/questions";
import { modifyAnswer } from "../../slice/answers";
import { saveUpdatingExplanationResourceContent, saveUpdatingResourceMedia } from "../../slice/files";
import { modifyResourceContent } from "../../slice/resource";
import TextArea from "antd/es/input/TextArea";

Quill.register("modules/better-table", QuillBetterTable);

const QuestionCard = ({ groupKey, questionRefs, resourceContent, editMode, questions, activeQuestion, setActiveQuestion, explanationResourceContent, commonTitle }) => {
    const [form] = useForm();
    const commonTitleMap = React.useMemo(() => {
        const map = {};
        questions.forEach((q, i) => {
            if (!map[q.commonTitle]) map[q.commonTitle] = [];
            map[q.commonTitle].push(i);
        });
        return map;
    }, [questions]);
    const [answers, setAnswers] = useState({});
    const [explanation, setExplanation] = useState();
    const [isCommonTitleRendered, setIsCommonTitleRendered] = useState(false);
    const dispatch = useDispatch();
    const { userAnswers } = useSelector((state) => state.questions);
    const { test } = useSelector((state) => state.test);

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["link", "image", "video"],
            ["clean"],
        ],
        "better-table": {
            operationMenu: {
                items: { unmergeCells: { text: "Unmerge cells" } },
            },
        },
        keyboard: {
            bindings: QuillBetterTable.keyboardBindings,
        },
    };

    const handleAnswerChange = (qId, userAnswerChoice, isCorrect, questionTitle, userAnswer, questionNumber) => {
        setAnswers((prev) => ({ ...prev, [qId]: { userAnswerChoice, isCorrect } }));

        dispatch(
            getUserAnswers({
                questionId: qId,
                questionTitle,
                userAnswerChoice,
                userAnswer,
                isCorrect,
                questionNumber,
            })
        );
    };

    const handleSaveAll = (values) => {
        const commonTitleGroups = {};

        questions.forEach((q, idx) => {
            if (!commonTitleGroups[q.commonTitle]) {
                commonTitleGroups[q.commonTitle] = values.questions[idx].commonTitle;
            }
        });

        const normalizedQuestions = questions.map((q, idx) => ({
            ...q,
            commonTitle: commonTitleGroups[q.commonTitle] || values.questions[idx].commonTitle,
        }));

        normalizedQuestions.forEach((question, questionIndex) => {
            const updatingQuestion = {
                title: values.questions[questionIndex].title,
                point: question.point,
                answerKey: values.questions[questionIndex].correct,
                explanation: values.questions[questionIndex].explanation,
                part: question.part,
                questionNumber: question.questionNumber,
                category: question.category,
                resourceContent:
                    checkType(resourceContent) === "url" ? question.resourceContent : values.passage,
                explanationResourceContent: question.explanationResourceContent,
                commonTitle: question.commonTitle,
            };

            dispatch(modifyQuestion({ id: question.id, question: updatingQuestion }));
        });
    };


    const handleCommonTitleChange = (newContent, originalTitle) => {
        const relatedIndexes = commonTitleMap[originalTitle] || [];
        relatedIndexes.forEach((i) => {
            form.setFieldValue(["questions", i, "commonTitle"], newContent);
        });
    };


    const handleUpdateContentImage = (options) => {
        const { file } = options;
        dispatch(
            saveUpdatingResourceMedia({
                resourceId: Number(questions[0].resourceContentId),
                testTitle: questions[0].testTitle,
                fileCategory: "QUESTION_IMAGE",
                currentResourceContent: questions[0]?.resourceContent,
                file,
                updatedFileName: questions[0].resourceContent.split("/").pop(),
            })
        );
    };

    const handleUpdateExplanationResource = (options, updatingQuestion) => {
        dispatch(saveUpdatingExplanationResourceContent(updatingQuestion));
    };

    useEffect(() => {
        if (checkType(resourceContent) === "url") {
            const img = new window.Image();
            img.src = resourceContent;
        }
    }, [questions]);

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSaveAll}
                initialValues={{
                    passage: resourceContent,
                    questions: questions?.map((q) => ({
                        title: q.title,
                        commonTitle: q.commonTitle,
                        answers: q.answers?.map((a) => ({ content: a.content })),
                        correct:
                            q.answers[0]?.content === null || q.answers[0]?.content === ''
                                ? q.answers?.find((ans) => ans.correct === "true")?.content || ""
                                : q.answers?.find((ans) => ans.correct === "true")
                                    ? String.fromCharCode(65 + q.answers.findIndex((ans) => ans.correct === "true"))
                                    : null,
                        explanation: q.explanation,
                    })),
                }}
            >


                <div className="flex gap-8 xl:flex-row flex-col !mb-4">
                    {/* Passage section */}
                    {editMode ? (
                        <div className="flex flex-col flex-[1.5]">
                            {checkType(resourceContent) === "url" ? (
                                <>
                                    <p>Nội dung câu hỏi (hình ảnh)</p>
                                    <Upload.Dragger
                                        customRequest={handleUpdateContentImage}
                                        fileList={null}
                                        multiple={false}
                                        className="!h-64 w-full flex flex-col justify-center items-center"
                                    >
                                        <p className="ant-upload-drag-icon w-24 h-24 flex items-center justify-center p-4">
                                            <FaUpload className="text-black text-6xl" />
                                        </p>
                                        <p className="text-xl font-medium">Kéo thả file vào đây</p>
                                        <span>
                                            hoặc <span className="text-blue-400">chọn file</span>
                                        </span>
                                    </Upload.Dragger>
                                </>
                            ) : (
                                <div className={checkType(resourceContent) === "null" ? "hidden" : ""}>
                                    <span className="block text-blue-700 font-bold text-base mb-1">
                                        Câu hỏi {questions[0]?.questionNumber}
                                        {questions.length > 1 && ` - ${questions[questions.length - 1]?.questionNumber}`}
                                    </span>


                                    <Form.Item name="passage" label="Nội dung câu hỏi (đoạn văn)">
                                        <ReactQuill theme="snow" className="bg-blue-50 rounded-md" modules={quillModules} />
                                    </Form.Item>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            className={
                                checkType(resourceContent) === "null"
                                    ? "hidden"
                                    : `bg-blue-50 rounded-lg p-6 mb-8 ml-4 flex flex-col  ${!editMode ? "flex-[1.5] max-h-[130vh] overflow-y-auto" : "flex-1"}`
                            }
                        >
                            <div className="flex items-center mb-4">
                                <span className="text-sm text-blue-600 font-medium">
                                    Questions {questions[0]?.questionNumber}
                                    {questions.length > 1 && ` - ${questions[questions.length - 1]?.questionNumber}`}
                                </span>
                            </div>

                            {checkType(resourceContent) === "url" ? (
                                <Image src={resourceContent} />
                            ) : (
                                <div
                                    className="prose w-full max-w-full text-lg [&_*]:w-full [&_table]:w-full [&_img]:max-w-full !text-[16px]"
                                    dangerouslySetInnerHTML={{ __html: resourceContent }}
                                />
                            )}
                        </div>
                    )}

                    {/* Questions section */}
                    <div className={`${!editMode ? "flex-[1] max-h-[130vh] overflow-y-auto" : "flex-1"}`}>


                        {questions.map((q, qId) => {
                            const shouldRenderTitle = qId === 0 || q.commonTitle !== questions[qId - 1].commonTitle;
                            const isTextAnswer = q.answers[0]?.content === null || q.answers[0]?.content === '';

                            return (
                                <div key={qId} className="">
                                    {shouldRenderTitle &&
                                        (editMode ? (
                                            <Form.Item
                                                name={["questions", qId, "commonTitle"]}
                                                valuePropName="value"
                                                getValueFromEvent={(content) => content}
                                            >
                                                <ReactQuill
                                                    theme="snow"
                                                    className="bg-blue-50 rounded-md !text-[16px]"
                                                    modules={quillModules}
                                                    onChange={(content) => handleCommonTitleChange(content, q.commonTitle)}
                                                />
                                            </Form.Item>


                                        ) : (
                                            <div
                                                className="prose w-full max-w-full text-lg [&_*]:w-full [&_table]:w-full [&_img]:max-w-full !text-[16px] my-2"
                                                dangerouslySetInnerHTML={{ __html: q.commonTitle }}
                                            />
                                        ))}
                                    <Card
                                        key={q.id}
                                        ref={(el) => (questionRefs.current[q.questionNumber] = el)}
                                        className="!border-2 border-gray-200 rounded-lg mb-2 h-auto !mt-2"
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                <div
                                                    onClick={() => setActiveQuestion(q.questionNumber)}
                                                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold cursor-pointer ${activeQuestion === q.questionNumber
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-blue-100 text-blue-600"
                                                        }`}
                                                >
                                                    {q.questionNumber}
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                {editMode ? (
                                                    <div className="bg-gray-50 p-6 rounded-lg border-2 border-blue-200">
                                                        {/* Question Number Header */}
                                                        <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-blue-300">
                                                            <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                                                                {q.questionNumber}
                                                            </div>
                                                            <h3 className="text-lg font-semibold text-gray-700">
                                                                Câu hỏi {q.questionNumber}
                                                            </h3>
                                                        </div>

                                                        {/* Question Title */}
                                                        <Form.Item
                                                            name={["questions", qId, "title"]}
                                                            label={<span className="text-base font-medium">Nội dung câu hỏi</span>}
                                                            className="mb-4"
                                                        >
                                                            <Input.TextArea
                                                                rows={3}
                                                                placeholder="Nhập nội dung câu hỏi..."
                                                                className="text-base"
                                                            />
                                                        </Form.Item>

                                                        {/* Answers Section */}
                                                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                            <h4 className="text-base font-medium mb-3 text-gray-700">
                                                                {isTextAnswer ? "Đáp án đúng" : "Các đáp án"}
                                                            </h4>

                                                            {/* Check if answers are null/empty - show text field instead of radio */}
                                                            {isTextAnswer ? (
                                                                <Form.Item
                                                                    name={["questions", qId, "correct"]}
                                                                    label={<span className="text-sm font-medium text-gray-600">Nhập đáp án đúng</span>}
                                                                    className="mb-0"
                                                                >
                                                                    <Input
                                                                        placeholder="Nhập đáp án..."
                                                                        className="text-base"
                                                                        size="large"
                                                                    />
                                                                </Form.Item>
                                                            ) : (
                                                                <>
                                                                    <div className="space-y-3 mb-4">
                                                                        {q.answers?.map((ans, aId) => (
                                                                            <Form.Item
                                                                                key={ans.id}
                                                                                name={["questions", qId, "answers", aId, "content"]}
                                                                                label={
                                                                                    <span className="inline-flex items-center gap-2">
                                                                                        <span className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                                                                                            {String.fromCharCode(65 + aId)}
                                                                                        </span>
                                                                                        <span className="text-sm font-medium text-gray-600">
                                                                                            Đáp án {aId + 1}
                                                                                        </span>
                                                                                    </span>
                                                                                }
                                                                                className="mb-3"
                                                                            >
                                                                                <Input
                                                                                    placeholder={`Nhập đáp án ${String.fromCharCode(65 + aId)}...`}
                                                                                    className="text-base"
                                                                                />
                                                                            </Form.Item>
                                                                        ))}
                                                                    </div>

                                                                    <Form.Item
                                                                        name={["questions", qId, "correct"]}
                                                                        label={<span className="text-sm font-medium text-green-700">Chọn đáp án đúng</span>}
                                                                        className="mb-0"
                                                                    >
                                                                        <Radio.Group className="flex gap-4">
                                                                            {q.answers?.map((ans, aId) => (
                                                                                <Radio
                                                                                    key={ans.id}
                                                                                    value={String.fromCharCode(65 + aId)}
                                                                                    className="text-base"
                                                                                >
                                                                                    <span className="font-medium">
                                                                                        {String.fromCharCode(65 + aId)}
                                                                                    </span>
                                                                                </Radio>
                                                                            ))}
                                                                        </Radio.Group>
                                                                    </Form.Item>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-[16px] !mb-2 w-full">
                                                        {test.type === "IELTS" ? q.title || "" : q.title || `Question ${q.questionNumber}`}
                                                    </p>
                                                )}

                                                {!editMode && (test?.type === "IELTS" && isTextAnswer ? (
                                                    <>
                                                        <Input.TextArea
                                                            className="!h-10 !w-1/2"
                                                            rows={1}
                                                            key={q.id}
                                                            onChange={(e) => handleAnswerChange(
                                                                q.id,
                                                                e.target.value,
                                                                q.answers.find((a) => a.id === e.target.value)?.correct,
                                                                q.title,
                                                                q.answers.find((a) => a.id === e.target.value)?.content,
                                                                q.questionNumber
                                                            )}
                                                        />
                                                    </>
                                                ) : (
                                                    <Radio.Group
                                                        onChange={(e) =>
                                                            handleAnswerChange(
                                                                q.id,
                                                                e.target.value,
                                                                q.answers.find((a) => a.id === e.target.value)?.correct,
                                                                q.title,
                                                                q.answers.find((a) => a.id === e.target.value)?.content,
                                                                q.questionNumber
                                                            )
                                                        }
                                                        value={userAnswers.find((a) => a.questionId === q.id)?.userAnswer || ""}
                                                        className="!space-y-3 !flex !flex-col"
                                                    >
                                                        {q.answers?.map((ans, index) =>
                                                            ans.content ? (
                                                                <Radio
                                                                    key={ans.id}
                                                                    value={
                                                                        index === 0
                                                                            ? "A"
                                                                            : index === 1
                                                                                ? "B"
                                                                                : index === 2
                                                                                    ? "C"
                                                                                    : "D"
                                                                    }
                                                                    className="!text-base"
                                                                >
                                                                    {ans.content}
                                                                </Radio>
                                                            ) : null
                                                        )}
                                                    </Radio.Group>
                                                ))}
                                            </div>
                                        </div>

                                        {editMode && (
                                            <div className="mt-6 pt-6 border-t-2 border-gray-200">
                                                {/* Explanation Section */}
                                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                                                    <Form.Item
                                                        name={["questions", qId, "explanation"]}
                                                        label={<span className="text-base font-medium text-gray-700">Giải thích đáp án</span>}
                                                        valuePropName="value"
                                                        getValueFromEvent={(value) => value}
                                                        className="mb-0"
                                                    >
                                                        <ReactQuill
                                                            theme="snow"
                                                            className="bg-white rounded-md"
                                                            modules={quillModules}
                                                            placeholder="Nhập giải thích chi tiết cho câu hỏi này..."
                                                        />
                                                    </Form.Item>
                                                </div>

                                                {/* File Upload Section */}
                                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                                    <h4 className="text-base font-medium mb-3 text-gray-700">
                                                        Tài liệu đính kèm (tùy chọn)
                                                    </h4>
                                                    <Upload.Dragger
                                                        customRequest={(options) =>
                                                            handleUpdateExplanationResource(options, {
                                                                questionId: q.id,
                                                                testTitle: q.testTitle,
                                                                fileCategory: "QUESTION_AUDIO",
                                                                currentResourceContent: q.explanationResourceContent,
                                                                file: options.file,
                                                                updatedFileName: q.explanationResourceContent?.split("/").pop(),
                                                            })
                                                        }
                                                        fileList={null}
                                                        multiple={false}
                                                        className="!h-48 w-full flex flex-col justify-center items-center"
                                                    >
                                                        <p className="ant-upload-drag-icon w-16 h-16 flex items-center justify-center p-2">
                                                            <FaUpload className="text-blue-500 text-4xl" />
                                                        </p>
                                                        <p className="text-base font-medium text-gray-700">Kéo thả file vào đây</p>
                                                        <span className="text-sm text-gray-500">
                                                            hoặc <span className="text-blue-500 font-medium">chọn file từ máy tính</span>
                                                        </span>
                                                        <p className="text-xs text-gray-400 mt-2">
                                                            Hỗ trợ: Audio, Video, PDF, Image
                                                        </p>
                                                    </Upload.Dragger>
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {editMode && (
                    <Form.Item className="mt-4">
                        <Button type="primary" htmlType="submit">
                            Lưu câu hỏi {questions[0]?.questionNumber}
                            {questions.length > 1 && ` - ${questions[questions.length - 1]?.questionNumber}`}
                        </Button>
                    </Form.Item>
                )}
            </Form>
        </>

    );
};

export default QuestionCard;