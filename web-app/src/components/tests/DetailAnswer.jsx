import { Card, Image, Modal } from "antd"
import { BulbFilled, BulbOutlined, CheckCircleOutlined, CloseCircleOutlined, FileImageFilled, FileImageOutlined, QuestionOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getOneQuestion } from "../../service/TestService";
import { retrieveSingleQuestion } from "../../slice/questions";

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

  const MediaRs = ({ source = "https://s4-media1.study4.com/media/e24/images_fixed2/image206.png" }) => {

    let type1 = ["jpeg", "jpg", "png"];
    // let type2 = ["mp4", "mp3"];
    let checkTypeImg = type1.some(t => source.includes(t));
    // let checkTypeAudio = type2.some(t => source.includes(t));

    return (
      <Card >
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-1">
          <FileImageFilled className="!text-blue-600" />
          {
            checkTypeImg ? "Hình ảnh câu hỏi" : "File âm thanh"
          }
        </h4>
        <div className={`w-full ${checkTypeImg ? "bg-gray-200 !h-[60vh]" : "bg-gray-200 !h-[15vh]"}  rounded-lg flex items-center justify-center  overflow-auto`}>
          {checkTypeImg === true ?
            <Image
              className="!w-full "
              src={source}
            />
            :
            <audio controls className="flex-1 mx-5">
              <source src="#" type="audio/mpeg" />
            </audio>
          }

        </div>
      </Card>
    )
  }

  const data = [
    { key: "A", text: "He is reading a book" },
    { key: "B", text: "He is writing a letter" },
    { key: "C", text: "He is using a computer" }, // đáp án đúng
    { key: "D", text: "He is talking on the phone" },
  ];

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

        <MediaRs source={questionData?.resourceContent} />

        {/* answer */}

        <div className="mt-5">
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