import { Button, Card, Col, Row, Tabs } from "antd";
import { CheckOutlined, CloseOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useState, useMemo } from "react";
import DetailAnswer from "./DetailAnswer";
import { PartLengthToeic, PartLengthIELTSListening, PartLengthIELTSReading } from "../../../data/FixedData";
import { useSelector } from "react-redux";

function getSelectedParts(attempt) {
  const examType = attempt?.type;
  const totalQuestions = attempt?.answers?.length || 0;

  if (examType === "TOEIC") {
    return PartLengthToeic;
  }

  if (examType === "IELTS") {
    const sectionType = attempt?.sectionResults?.[0]?.type;
    const sectionTypeUpper = sectionType?.toUpperCase();

    if (sectionTypeUpper === "LISTENING") {
      if (totalQuestions < 40 && totalQuestions > 0) {
        const questionsPerPart = 10;
        const numParts = Math.ceil(totalQuestions / questionsPerPart);

        return Array.from({ length: numParts }, (_, i) => {
          const start = i * questionsPerPart + 1;
          const remainingQuestions = totalQuestions - i * questionsPerPart;
          const length = Math.min(questionsPerPart, remainingQuestions);

          return {
            part: i + 1,
            length: length,
            start: start
          };
        });
      }
      return PartLengthIELTSListening;
    }

    if (sectionTypeUpper === "READING") {
      if (totalQuestions < 40 && totalQuestions > 0) {
        const questionsPerPart = 13;
        const numParts = Math.ceil(totalQuestions / questionsPerPart);

        return Array.from({ length: numParts }, (_, i) => {
          const start = i * questionsPerPart + 1;
          const remainingQuestions = totalQuestions - i * questionsPerPart;
          const length = Math.min(questionsPerPart, remainingQuestions);

          return {
            part: i + 1,
            length: length,
            start: start
          };
        });
      }
      return PartLengthIELTSReading;
    }

    return [];
  }

  return [];
}

const SectionAnswer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Choice, setChoice] = useState("");
  const [Correct, setCorrect] = useState("");
  const [questionId, setQuestionId] = useState(null);

  const { attempt } = useSelector(state => state.attempts);

  console.log("=== DEBUG START ===");
  console.log("Total answers:", attempt?.answers?.length);
  console.log("Exam type:", attempt?.type);
  console.log("Section type:", attempt?.sectionResults?.[0]?.type);
  console.log("First 3 answers:", attempt?.answers?.slice(0, 3));
  console.log("=== DEBUG END ===");

  const parts = useMemo(() => {
    const result = getSelectedParts(attempt);
    console.log("Generated parts:", result);
    return result;
  }, [attempt]);

  const Questions = ({ questionNumber, questionId, choice = "N", correct = "N" }) => {
    const check = choice === correct;

    // console.log(`Rendering Q${questionNumber}: choice="${choice}", correct="${correct}"`);

    return (
      <Col xs={{ flex: '100%' }} sm={{ flex: '50%' }} lg={{ flex: '25%' }}>
        <div className="flex flex-nowrap items-center justify-center space-x-2 rounded-lg px-3 py-2 border border-gray-200">
          <span className="text-black rounded-full flex items-center justify-center text-sm font-bold">
            {questionNumber}.
          </span>
          <span className="text-sm text-gray-700 whitespace-nowrap">
            {(choice || "N") + " -> " + (correct || "N")}
          </span>
          {check ? (
            <CheckOutlined className="!font-bold !text-emerald-400" />
          ) : (
            <CloseOutlined className="!font-bold !text-rose-400" />
          )}
          {/* <Button
            size="small"
            type="text"
            className="!px-0 !text-blue-700"
            onClick={() => {
              setIsModalOpen(true);
              setChoice(choice);
              setCorrect(correct);
              setQuestionId(questionId);
            }}
          >
            [Chi tiết]
          </Button> */}
        </div>
      </Col>
    );
  };

  const items = parts.map((part) => {
    console.log(`Processing Part ${part.part}: start=${part.start}, length=${part.length}`);

    return {
      key: String(part.part),
      label: `Part ${part.part}`,
      children: (
        <Row gutter={[16, 16]}>
          {Array.from({ length: part.length }).map((_, index) => {
            const globalIndex = part.start - 1 + index;

            {/* console.log(`Part ${part.part}, index ${index}, globalIndex ${globalIndex}, totalAnswers: ${attempt.answers?.length}`); */ }

            if (!attempt?.answers) {
              console.warn("No answers array!");
              return null;
            }

            if (globalIndex >= attempt.answers.length) {
              console.warn(`globalIndex ${globalIndex} >= ${attempt.answers.length}, skipping`);
              return null;
            }

            const answerData = attempt.answers[globalIndex];

            {/* console.log(`Question ${globalIndex + 1} data:`, answerData); */ }

            if (!answerData) {
              console.warn(`No data for globalIndex ${globalIndex}`);
              return null;
            }

            return (
              <Questions
                key={`question-${globalIndex}`}
                questionNumber={globalIndex + 1}
                questionId={answerData?.questionId}
                choice={answerData?.userAnswer || ""}
                correct={answerData?.correctAnswer || ""}
              />
            );
          })}
        </Row>
      )
    };
  });

  console.log("Total items (tabs):", items.length);

  if (!attempt?.answers || attempt.answers.length === 0) {
    return (
      <Card className="!shadow-lg !pb-3 !mt-7" id="my-section">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          <UnorderedListOutlined className="mr-2" />
          Chi tiết từng phần
        </h3>
        <p className="text-gray-500">Không có dữ liệu câu trả lời</p>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="!shadow-lg !pb-3 !mt-7" id="my-section">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          <UnorderedListOutlined className="mr-2" />
          Chi tiết từng phần
        </h3>
        <p className="text-gray-500">Không thể tạo cấu hình parts</p>
      </Card>
    );
  }

  return (
    <Card className="!shadow-lg !pb-3 !mt-7" id="my-section">
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        <UnorderedListOutlined className="mr-2" />
        Chi tiết từng phần
      </h3>

      <Tabs
        defaultActiveKey={items[0]?.key ?? "1"}
        type="card"
        tabBarGutter={12}
        tabBarStyle={{ marginBottom: 24 }}
        items={items}
      />

      <DetailAnswer
        isModalOpen={isModalOpen}
        handleOk={() => setIsModalOpen(false)}
        handleCancel={() => setIsModalOpen(false)}
        correctAnswer={Correct}
        userAnswer={Choice}
        questionId={questionId}
      />
    </Card>
  );
};

export default SectionAnswer;