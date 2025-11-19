import { Button, Card, Typography, Row, Col, Tabs, Spin } from "antd"
import {
  ArrowLeftOutlined, CheckCircleFilled,
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  CrownOutlined,
  EyeFilled,
  MinusOutlined,
  PercentageOutlined
} from '@ant-design/icons';
import BoxComment from "../../components/tests/BoxComment";
import RightSider from "../../components/tests/RightSider"
import SectionAnswer from "../../components/tests/AfterPage/SectionAnswer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { retrieveAttempt } from "../../slice/attempts";
import { formatTime } from "../../service/GlobalFunction";
import SectionPoint from "../../components/tests/AfterPage/SectionPoint";

const AfterTestPage = () => {
  const { Text } = Typography;
  const { attemptId } = useParams();

  const dispatch = useDispatch();

  const { attempt, loading } = useSelector(state => state.attempts);

  useEffect(() => {
    dispatch(retrieveAttempt(attemptId));
  }, [attemptId, dispatch]);

  const sectionResults = attempt?.sectionResults || [];

  const correctAnswers = sectionResults.map(s => s?.correctAnswers || 0).reduce((acc, curr) => acc + curr, 0);
  const totalQuestions = sectionResults.map(s => s?.totalQuestions || 0).reduce((acc, curr) => acc + curr, 0);
  const maxPoint = sectionResults.map(s => s?.maxPossibleScore || 0).reduce((acc, curr) => acc + curr, 0);
  const totalPoint = sectionResults.map(s => s?.sectionScore || 0).reduce((acc, curr) => acc + curr, 0);
  const timeTaken = attempt?.timeTaken || 0;

  const cols = [
    {
      "icon": <CheckCircleFilled className="!text-green-400" />,
      "content": `${correctAnswers}/${totalQuestions}`,
      "tag": "Số câu đúng",
      "bgColor": "bg-green-50",
      "tColor": "text-green-600"
    },
    {
      "icon": <PercentageOutlined className="!text-blue-400" />,
      "content": totalQuestions > 0 ? `${Math.round(correctAnswers / totalQuestions * 100)}%` : "0%",
      "tag": "Độ chính xác",
      "bgColor": "bg-blue-50",
      "tColor": "text-blue-600"
    },
    {
      "icon": <ClockCircleOutlined className="!text-purple-400" />,
      "content": `${formatTime(timeTaken)}`,
      "tag": "Thời gian hoàn thành",
      "bgColor": "bg-purple-50",
      "tColor": "text-purple-600"
    },
    {
      "icon": <CheckOutlined className="!text-green-400" />,
      "content": `${correctAnswers}`,
      "tag": "Trả lời đúng",
      "bgColor": "bg-green-50",
      "tColor": "text-green-600"
    },
    {
      "icon": <CloseOutlined className="!text-red-400" />,
      "content": `${totalQuestions - correctAnswers}`,
      "tag": "Trả lời sai",
      "bgColor": "bg-red-50",
      "tColor": "text-red-600"
    },
    {
      "icon": <MinusOutlined />,
      "content": "0",
      "tag": "Bỏ qua",
      "bgColor": "bg-gray-50",
      "tColor": "text-gray-600"
    },

  ];

  const ColContent = ({ icon, content, tag, bgColor, tColor }) => {
    return (
      <Col span={8}>
        <div className={`${bgColor} rounded-lg p-4 text-center }`}>
          {icon}
          <div className={`text-2xl font-bold ${tColor}`}>{content}</div>
          <div className="text-sm text-gray-600">{tag}</div>
        </div>
      </Col>
    )
  };

  const handleScroll = () => {
    document.getElementById("my-section")?.scrollIntoView({ behavior: "smooth" });
  };


  return (
    <div className="bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-5">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">

          <div className="lg:col-span-7 ">
            {loading && !attempt ? (
              <div className="h-96 flex justify-center items-center">
                <Spin size="large" tip="Đang tải kết quả..." />
              </div>
            ) : (
              <>
                <Card className="!shadow-lg !pb-3">
                  <div className="flex justify-between items-center mb-4 flex-col md:flex-row md:gap-0 !gap-3">
                    <h1 className="text-2xl font-bold text-gray-800">Test result - {attempt?.testTitle?.includes("_") ? attempt.testTitle.split("_").join(" ") : attempt?.testTitle}</h1>
                    <div className="flex !space-x-2">
                      <Button icon={<ArrowLeftOutlined />} size="middle">
                        <span className="text-gray-700">Back to test list</span>
                      </Button>
                      <Button icon={<EyeFilled />} size="middle" type="primary" onClick={handleScroll} >
                        <span>See result</span>
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Overall */}
                <Card className="!shadow-lg !pb-3 !mt-7">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <CrownOutlined className="text-4xl !text-yellow-300" />
                      <h2 className="text-4xl font-bold text-gray-800">{totalPoint.toFixed(1) + "/" + maxPoint.toFixed(1)}</h2>
                    </div>
                    <p className="text-lg text-gray-600">{attempt?.type} Score</p>
                  </div>

                  <Row gutter={[16, 16]}>
                    {cols.map((col, index) => {
                      return (
                        <ColContent key={index} icon={col.icon} content={col.content} tag={col.tag} bgColor={col.bgColor} tColor={col.tColor} />
                      )
                    })}
                  </Row>
                </Card>

                <Card className="!shadow-lg !pb-3 !mt-7">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Detailed scores by skill</h3>
                  <div className="space-y-6">
                    {
                      sectionResults.map((s, index) => {
                        return (
                          <SectionPoint key={index} skill={s.type} score={s.sectionScore} total={s.maxPossibleScore} percent={Math.round(s.correctAnswers / s.totalQuestions * 100)} />
                        )
                      })
                    }
                  </div>
                </Card>

                {attempt && <SectionAnswer type={attempt.type} />}

                {/* comment */}
                <BoxComment />
              </>
            )}
          </div>

          <div className="lg:col-span-3 space-y-6">
            <RightSider />
          </div>

        </div>
      </div>
    </div>
  )
}
export default AfterTestPage