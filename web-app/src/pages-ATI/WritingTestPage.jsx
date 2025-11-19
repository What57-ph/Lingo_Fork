import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InputColumn from "../components-ATI/writing/InputColumn";
import { toast } from "react-toastify";
import { createAttempts } from "../slice/attempts";
import { retrieveQuestionForTest } from "../slice/questions";


function WritingTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: testId, title } = useParams();

  // Kiểm tra chế độ: có testId = Lock Mode (có đề sẵn), không có = Practice Mode (tự nhập đề)
  const isLockMode = !!testId;

  const {
    questions,
    loading: pageLoading,
    error
  } = useSelector((state) => state.questions);

  const { user } = useSelector((state) => state.authentication);


  const lockedData = useMemo(() => {
    if (!isLockMode || !questions || questions.length === 0) {
      return null;
    }

    const task = questions[0];

    return {
      id: task.testId,
      taskType: task.part,
      promptText: task.title,
      promptImage: task.resourceContent
    };
  }, [isLockMode, questions]);


  // CHỈ fetch đề bài khi ở Lock Mode
  useEffect(() => {
    if (isLockMode && testId) {
      console.log(`Fetching test với ID: ${testId}`);
      dispatch(retrieveQuestionForTest(testId))
        .unwrap()
        .catch((error) => {
          console.error("Không tìm thấy bài test:", error);
          toast.error("Không tìm thấy bài test!");
        });
    }
  }, [testId, isLockMode, dispatch]);

  const handleGrade = useCallback(
    async (formData) => {
      setIsLoading(true);
      toast.info("Đang nộp bài làm của bạn...");

      try {
        const taskText = isLockMode ? lockedData.promptText : formData.task;
        const essayText = formData.essay;

        if (!essayText || !taskText) {
          toast.error("Vui lòng nhập đầy đủ đề bài và bài luận.");
          setIsLoading(false);
          return;
        }
        console.log(taskText);

        // PRACTICE MODE: Không lưu attempt, chuyển thẳng sang trang kết quả
        if (!isLockMode) {
          console.log("🎯 Practice Mode: Không lưu attempt, chuyển sang trang practice result");
          toast.success("Đang chấm bài...");

          navigate(`results/practice`, {
            state: {
              task: taskText,
              essay: essayText,
              promptImage: null
            }
          });
          return;
        }

        // LOCK MODE: Tạo và lưu attempt
        const userId = user?.sub;
        const quizId = lockedData.id;
        const gradingIeltsId = "mock-writing-" + Date.now();

        const attemptData = {
          quizId: quizId,
          testTitle: title,
          userId: userId,
          timeTaken: 3600,
          type: "IELTS",
          field: ["Writing"],
          gradingIeltsId: gradingIeltsId,
          answers: [
            { questionId: 0, userAnswer: essayText }
          ]
        };

        console.log("💾 Lock Mode: Tạo attempt với quiz id:", quizId);

        const action = await dispatch(createAttempts(attemptData));

        if (!createAttempts.fulfilled.match(action)) {
          throw new Error(action.payload || "Lỗi khi lưu bài làm!");
        }

        const newAttemptId = action.payload;

        if (!newAttemptId) {
          throw new Error("Không lấy được ID bài làm sau khi tạo.");
        }

        toast.success("Nộp bài thành công! Đang chuyển trang kết quả.");
        navigate(`results/${newAttemptId}`, {
          state: {
            task: taskText,
            essay: essayText,
            promptImage: lockedData.promptImage
          }
        });

      } catch (error) {
        console.error("Lỗi khi nộp bài viết:", error);
        toast.error(`Đã xảy ra lỗi: ${error.message}`);
        setIsLoading(false);
      }
    },
    [navigate, dispatch, isLockMode, lockedData, user, title]
  );

  const renderContent = () => {
    // CHỈ hiển thị loading/error khi ở Lock Mode
    if (isLockMode && pageLoading) {
      return (
        <div className="text-center p-20 bg-white rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700">
            Đang tải đề bài...
          </h2>
          <p className="text-gray-500 mt-2">Vui lòng chờ trong giây lát.</p>
        </div>
      );
    }

    if (isLockMode && !pageLoading && (error || !lockedData)) {
      return (
        <div className="text-center p-20 bg-red-50 rounded-xl shadow-lg border border-red-200">
          <h2 className="text-2xl font-semibold text-red-700">Lỗi</h2>
          <p className="text-red-600 mt-2">
            {error ? error.message : `Không tìm thấy bài test với ID: ${testId}.`}
          </p>
        </div>
      );
    }

    // Render InputColumn cho cả 2 mode
    return (
      <InputColumn
        onGrade={handleGrade}
        isLoading={isLoading}
        lockedData={lockedData}
      />
    );
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 md:p-10 rounded-xl shadow-lg mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            AI Writing Assessment
          </h1>
          <p className="text-lg md:text-xl text-indigo-100">
            {isLockMode
              ? "Hoàn thành bài viết theo đề bài được cung cấp"
              : "Nhập đề bài và bài làm của bạn để được chấm điểm chi tiết"}
          </p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default WritingTestPage;