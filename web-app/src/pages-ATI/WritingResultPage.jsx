import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import WritingDisplayPanel from "../components-ATI/writing/WritingDisplayPanel";
import WritingAnalysisPanel from "../components-ATI/writing/WritingAnalysisPanel";
import { retrieveAttempt, updateAttempt } from "../slice/attempts";
import { createSubmit, resetWritingResult, setWritingResult } from "../slice-ATI/writing";
import { retrieveQuestionForTest } from "../slice/questions";

export default function WritingResultPage() {
  const [leftWidth, setLeftWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);
  const [promptImageUrl, setPromptImageUrl] = useState(null);
  const [isProcessed, setIsProcessed] = useState(false);

  const { id: attemptId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  // Kiểm tra Practice Mode
  const isPracticeMode = attemptId === 'practice';

  // Lấy dữ liệu từ state khi chuyển trang
  const taskFromState = location.state?.task;
  const essayFromState = location.state?.essay;
  const imageFromState = location.state?.promptImage;

  // Redux state
  const {
    attempt,
    loading: attemptLoading,
    error: attemptError
  } = useSelector((state) => state.attempts);

  const {
    result: assessmentResult,
    loading: assessmentLoading,
    error: assessmentError
  } = useSelector((state) => state.writing);

  const {
    questions,
    loading: quizLoading,
    error: quizError
  } = useSelector((state) => state.questions);

  const quizData = useMemo(() => {
    if (!questions || questions.length === 0) {
      return null;
    }
    const task = questions[0];
    return {
      id: task.testId,
      questionId: task.id,
      taskType: task.part,
      promptText: task.title,
      promptImage: task.resourceContent
    };
  }, [questions]);


  // 1. Reset kết quả AI khi vào trang mới
  useEffect(() => {
    dispatch(resetWritingResult());
    setIsProcessed(false);
  }, [attemptId, dispatch]);

  // 2. Fetch Attempt (CHỈ cho Lock Mode)
  useEffect(() => {
    if (attemptId && !isPracticeMode) {
      dispatch(retrieveAttempt(attemptId));
    }
  }, [attemptId, dispatch, isPracticeMode]);

  // 3. Fetch Đề bài thật (CHỈ cho Lock Mode và có attempt)
  useEffect(() => {
    const quizId = attempt?.quizId;
    if (!attemptLoading && attempt && quizId && quizId > 0 && !isPracticeMode) {
      const isDataMissing = !questions || questions.length === 0;
      const isDataMismatched = questions && questions.length > 0 && questions[0]?.testId !== quizId;

      if (isDataMissing || isDataMismatched) {
        console.log(`(F5/History) Fetching đề bài thật với ID: ${quizId}`);
        dispatch(retrieveQuestionForTest(quizId));
      }
    }
  }, [attempt, attemptLoading, dispatch, questions, isPracticeMode]);

  // 4. Xử lý xem Lịch sử (History Flow) - CHỈ cho Lock Mode
  useEffect(() => {
    if (attempt && attempt.aiFeedback && !isProcessed && !isPracticeMode) {
      console.log("🌀 (Flow Lịch sử): Tìm thấy feedback cũ, đang tải vào Redux...");
      try {
        const feedback = typeof attempt.aiFeedback === 'string'
          ? JSON.parse(attempt.aiFeedback)
          : attempt.aiFeedback;

        dispatch(setWritingResult(feedback));
        setIsProcessed(true);
      } catch (e) {
        console.error("Lỗi parse AI feedback cũ:", e);
        setIsProcessed(true);
      }
    }
  }, [attempt, isProcessed, dispatch, isPracticeMode]);


  // 5. Xử lý Chấm bài (AI Grading Flow)
  useEffect(() => {
    // --- PRACTICE MODE ---
    if (isPracticeMode) {
      if (taskFromState && essayFromState && !isProcessed) {
        console.log("📤 (Flow Tự luyện): Đang gọi AI...");
        setIsProcessed(true);

        const aiFormData = {
          task: taskFromState,
          essay: essayFromState,
        };

        dispatch(createSubmit(aiFormData))
          .unwrap()
          .then((result) => {
            console.log("✅ (Flow Tự luyện): Nhận kết quả AI thành công.");
          })
          .catch((error) => {
            console.error("❌ Lỗi khi gọi AI (Tự luyện):", error);
            setIsProcessed(false);
          });
      }
      return;
    }

    // --- LOCK MODE (Nộp bài mới) ---
    const isReadyForNewCall = attempt && !attempt.aiFeedback;
    const taskToSubmit = taskFromState || quizData?.promptText;
    const essayToSubmit = essayFromState || attempt?.answers[0]?.userAnswer;

    const canInitiateAiCall =
      isReadyForNewCall &&
      taskToSubmit &&
      essayToSubmit &&
      !assessmentResult &&
      !assessmentLoading &&
      !isProcessed;

    if (canInitiateAiCall) {
      console.log("📤 (Flow Mới): Không có feedback cũ, đang gọi AI...");
      setIsProcessed(true);

      const aiFormData = {
        task: taskToSubmit,
        essay: essayToSubmit,
      };

      dispatch(createSubmit(aiFormData))
        .unwrap()
        .then((result) => {
          console.log("✅ Nhận được kết quả AI:", result);
          const score = result?.overall_band_score;

          if (attemptId && (score !== null && score !== undefined)) {
            console.log(`✨ Đang cập nhật attempt [${attemptId}] với điểm VÀ feedback...`);

            const attemptData = {
              attemptId: attemptId,
              score: Math.round(score),
              aiFeedback: JSON.stringify(result)
            };

            dispatch(updateAttempt(attemptData))
              .unwrap()
              .then(() => console.log(`✅ Cập nhật attempt [${attemptId}] thành công.`))
              .catch((err) => console.error(`❌ Lỗi khi cập nhật attempt:`, err));
          }
        })
        .catch((error) => {
          console.error("❌ Lỗi khi gọi AI:", error);
          setIsProcessed(false);
        });
    }
  }, [
    isPracticeMode,
    taskFromState, essayFromState,
    quizData, attempt,
    assessmentResult, assessmentLoading,
    isProcessed, dispatch, attemptId
  ]);

  // Xử lý URL ảnh
  useEffect(() => {
    let imageUrl = null;
    const imageSource = imageFromState || quizData?.promptImage;
    if (imageSource) {
      if (typeof imageSource === "string") {
        imageUrl = imageSource;
      } else if (imageSource instanceof File || imageSource instanceof Blob) {
        imageUrl = URL.createObjectURL(imageSource);
      }
    }
    setPromptImageUrl(imageUrl);
    return () => {
      if (imageUrl && (imageSource instanceof File || imageSource instanceof Blob)) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageFromState, quizData?.promptImage]);

  // Xử lý kéo thả resize panel
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;
      if (newLeftWidth >= 20 && newLeftWidth <= 80) {
        setLeftWidth(newLeftWidth);
      }
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  // --- Render Logic ---

  // Tính toán trạng thái Loading
  const isLoading = isPracticeMode
    ? assessmentLoading
    : (attemptLoading || quizLoading || assessmentLoading);

  // Tính toán lỗi (CHỈ cho Lock Mode)
  const combinedError = isPracticeMode
    ? assessmentError
    : (attemptError || assessmentError || quizError);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen w-full bg-white text-black font-sans items-center justify-center p-4">
        <div className="text-center max-w-2xl w-full mx-auto p-10 bg-white rounded-xl">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            Đang tải kết quả bài làm...
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {assessmentLoading
              ? "LexiBot đang phân tích bài viết của bạn. Việc này có thể mất một chút thời gian..."
              : "Đang tải dữ liệu bài làm..."}
          </p>
          <div className="flex justify-center items-center space-x-2">
            <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  // Chỉ hiển thị lỗi cho Lock Mode
  if (!isPracticeMode && (combinedError || (!attempt && !attemptLoading))) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold text-red-700 mb-4">
          Lỗi Tải Dữ Liệu
        </h1>
        <p className="text-gray-600">
          {combinedError ? (typeof combinedError === 'object' ? combinedError.message : combinedError) : "Không tìm thấy bài làm với ID này."}
        </p>
        <Link to="/" className="text-blue-600 mt-4">Quay về trang chủ</Link>
      </div>
    );
  }

  // Không có kết quả
  if (!assessmentResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">
          Không có dữ liệu phân tích
        </h1>
        <p className="text-gray-600 mb-6">
          {isPracticeMode
            ? "Dữ liệu bài tự luyện đã mất sau khi tải lại trang."
            : "Hệ thống đang xử lý hoặc không tìm thấy kết quả."}
        </p>
        <Link to="/" className="text-blue-600 mt-4">Quay về trang chủ</Link>
      </div>
    );
  }

  // Chuẩn bị dữ liệu hiển thị
  const task = (quizData?.taskType === "Task 1" ? 1 : 2) || (taskFromState === "Task 1" ? 1 : 2) || 1;
  const promptText = taskFromState || quizData?.promptText || attempt?.answers[0]?.taskText || "Đang tải đề bài...";
  const essayText = essayFromState || attempt?.answers[0]?.userAnswer || "";
  const wordCount = essayText
    ? essayText.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div ref={containerRef} className="flex flex-1 overflow-hidden mt-2">
        <WritingDisplayPanel
          width={leftWidth}
          task={task}
          promptText={promptText}
          essayText={essayText}
          promptImageUrl={promptImageUrl}
          wordCount={wordCount}
        />

        <div
          className="w-1 bg-gray-300 hover:bg-teal-500 cursor-col-resize transition-colors relative group"
          onMouseDown={() => setIsResizing(true)}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-10 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <WritingAnalysisPanel
          width={100 - leftWidth}
          aiData={assessmentResult}
          wordCount={wordCount}
        />
      </div>
    </div>
  );
}