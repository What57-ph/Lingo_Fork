import { Card, Image, Modal } from "antd"
import { BulbFilled, BulbOutlined, CheckCircleOutlined, CloseCircleOutlined, FileImageFilled, FileImageOutlined, QuestionOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getOneQuestion } from "../../../service/TestService";
import { retrieveSingleQuestion } from "../../../slice/questions";

const DetailAnswer = ({ isModalOpen, handleOk, handleCancel, correctAnswer = "", userAnswer = "", questionId }) => {

  const dispatch = useDispatch();
  const [questionData, setQuestionData] = useState([]);
  // let id = 2;

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const data = await dispatch(retrieveSingleQuestion(questionId)).unwrap();
        console.log(data);

        setQuestionData(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
      }
    };

    if (questionId) {
      fetchQuestion();
    }
  }, [questionId, dispatch]);

  const renderResource = (source, type, title) => {
    console.log("audio", encodeURI(source));

    if (!source) return null;

    let content = null;
    let icon = <FileImageFilled className="!text-blue-600" />;

    if (type === "image") {
      content = (
        <div className="w-full bg-gray-200 !h-[60vh] rounded-lg flex items-center justify-center overflow-auto">
          <Image className="!w-full" src={source} />
        </div>
      );
    } else if (type === "audio") {
      const encodedSource = encodeURI(source);

      content = (
        <div className="w-full bg-gray-200 !h-[15vh] rounded-lg flex items-center justify-center overflow-auto">
          <audio controls className="flex-1 mx-5">
            <source src={encodedSource} type="audio/mpeg" />
            Trình duyệt của bạn không hỗ trợ file âm thanh này.
          </audio>
        </div>
      );
    } else if (type === "text") {
      icon = <UnorderedListOutlined className="!text-blue-600" />;
      content = (
        <div className="bg-gray-100 p-4 rounded-lg max-h-[60vh] overflow-y-auto">
          <p className="text-gray-700 whitespace-pre-wrap">{source}</p>
        </div>
      );
    } else {
      return null;
    }

    return (
      <Card className="!mb-5">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-1">
          {icon}
          {title}
        </h4>
        {content}
      </Card>
    );
  };

  const isImageFile = (url) => typeof url === 'string' && ["jpeg", "jpg", "png"].some(t => url.toLowerCase().includes(t));
  const isAudioFile = (url) => typeof url === 'string' && ["mp3", "mp4"].some(t => url.toLowerCase().includes(t));

  const AnswerStyle = ({ num, text, correctAnswer, userAnswer }) => {
    let borderClass = "!border-2 !border-gray-300";
    let textClass = "";
    const letterMap = ['A', 'B', 'C', 'D'];
    const displayNum = letterMap[num] || '?';
    const isSelected = displayNum === userAnswer;
    const isCorrectSelection = isSelected && userAnswer === correctAnswer;

    if (displayNum === correctAnswer) {
      borderClass = "!border-2 !border-green-600 bg-green-50";
      textClass = "text-green-700 font-medium";
    } else if (displayNum === userAnswer && userAnswer !== correctAnswer) {
      borderClass = "!border-2 !border-red-600 bg-red-50 ";
      textClass = "text-red-600 font-medium";
    }

    return (
      <Card size="small" className={borderClass}>
        <div className="flex flex-row items-center justify-between space-x-3">
          <div className="flex flex-row items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold
          ${displayNum === correctAnswer
                  ? "bg-green-500 text-white"
                  : displayNum === userAnswer
                    ? "bg-red-500 text-white"
                    : "bg-gray-100"}`}
            >
              {displayNum}
            </div>
            <span className={textClass}>{text}</span>
          </div>
          {isSelected && (
            <span className={`${isCorrectSelection ? "text-green-600" : "text-red-600"} font-bold`}>
              {isCorrectSelection ? <CheckCircleOutlined className="!text-base" /> : <CloseCircleOutlined className="!text-base" />}
            </span>
          )}
        </div>
      </Card>

    );
  };

  return (
    <Modal
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={{
        xs: '90%',
        sm: '85%',
        md: '75%',
        lg: '65%',
        xl: '60%',
        xxl: '50%',
      }}
      style={{
        top: 20
      }}
    >
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <QuestionOutlined className="text-2xl !text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Chi tiết câu hỏi #<span id="enhancedQuestionNumber">{questionData?.id}</span></h3>
              <p className="text-gray-600">{questionData?.part + " - " + questionData?.category}</p>
            </div>
          </div>
        </div>

        {isAudioFile(questionData?.explanationResourceContent) && renderResource(questionData?.explanationResourceContent, "audio", "File âm thanh")}
        {isImageFile(questionData?.resourceContent) && renderResource(questionData?.resourceContent, "image", "Hình ảnh đề bài")}
        {questionData?.part && ["Part 5", "Part 6", "Part 7"].includes(questionData?.part) && !isImageFile(questionData?.resourceContent) && renderResource(questionData?.resourceContent, "text", "Nội dung đề bài")}


        {/* answer */}

        <div className="mt-5">
          {questionData?.title && (
            <p className="text-gray-800 mt-2 font-semibold text-base">{"Câu " + questionData?.id + " : " + questionData.title}</p>
          )}
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-1">
            <UnorderedListOutlined />
            Các lựa chọn trả lời
          </h4>
          <div className="flex flex-col !space-y-3">
            {questionData?.answers?.map((ans, index) => {
              return (
                <AnswerStyle
                  key={ans.id}
                  num={index}   // sth wrong
                  text={ans.content}
                  correctAnswer={correctAnswer}
                  userAnswer={userAnswer}
                />
              )
            })}
          </div>
        </div>

        {/* explain */}

        <Card className="!mt-5 !bg-blue-50 border !border-blue-200">
          <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-1">
            <BulbOutlined />
            Giải thích chi tiết
          </h4>
          <p className="text-gray-700 leading-relaxed mb-4">
            {questionData?.explanation || 'Trong hình ảnh, chúng ta có thể thấy một người đàn ông đang ngồi trước bàn làm việc. Anh ta đang đặt tay lên bàn phím và nhìn vào màn hình máy tính. Đây rõ ràng là hành động "sử dụng máy tính" (using a computer), do đó đáp án C là chính xác nhất.'}
          </p>
        </Card>

      </div>
    </Modal>
  )
}
export default DetailAnswer