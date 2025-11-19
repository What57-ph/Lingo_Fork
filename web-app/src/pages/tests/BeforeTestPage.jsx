import { Button, Card, Select, Space, Typography } from "antd";
import Brc from "../BreadCum";
import {
  HeartOutlined,
  ClockCircleFilled,
  QuestionCircleFilled,
  UnorderedListOutlined,
  WechatFilled,
  TeamOutlined,
  CaretRightFilled,
  EyeFilled,
  ReadFilled,
  BulbFilled,
  ShareAltOutlined,
} from "@ant-design/icons";
import BoxComment from "../../components/tests/BoxComment";
import RightSider from "../../components/tests/RightSider";
import HistoryAttempts from "../../components/tests/BeforePage/HistoryAttempts";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { retrieveCommentsOfTest } from "../../slice/commentSlice";
import { retrieveSingleTest } from "../../slice/tests";

const BeforeTestPage = () => {
  const { Text } = Typography;
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [testInfo, setTestInfo] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(retrieveCommentsOfTest(id))
  }, [id, dispatch])

  useEffect(() => {
    dispatch(retrieveSingleTest(id))
      .unwrap()
      .then((response) => {
        console.log(response);
        setTestInfo(response);
      });
  }, [dispatch, id]);

  const hasScrolled = useRef(false);
  const { commentOfTest, loading } = useSelector((state) => state.comments);

  useEffect(() => {
    const scrollToCommentId = location.state?.scrollToCommentId;

    if (scrollToCommentId && !hasScrolled.current && !loading && commentOfTest.length > 0) {

      const attemptScroll = (attempts = 0, maxAttempts = 15) => {
        const commentElement = document.getElementById(scrollToCommentId);

        if (commentElement) {

          setTimeout(() => {
            commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

            commentElement.style.transition = 'background-color 0.3s ease';

            setTimeout(() => {
              commentElement.style.backgroundColor = '';
            }, 2500);
          }, 100);

          hasScrolled.current = true;
        } else if (attempts < maxAttempts) {

          setTimeout(() => {
            attemptScroll(attempts + 1, maxAttempts);
          }, 200);
        }
      };

      setTimeout(() => attemptScroll(), 300);
    }

    return () => {
      if (location.state?.scrollToCommentId) {
        hasScrolled.current = false;
      }
    };
  }, [location.state, loading, commentOfTest]);

  const handleDoTest = () => navigate(location.pathname + "/doTests");

  return (
    <div className="bg-gray-50">
      {/* breadcumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Brc value1="TOEIC" value2="Practice test 1" />
      </div>

      {/* main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          <div className="lg:col-span-7 ">
            {/* action card */}
            <Card className="!shadow-lg !pb-3">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      #{testInfo?.type}
                    </span>
                    <Button color="default" variant="text">
                      <HeartOutlined className="text-xl text-shadow-gray-200" />
                    </Button>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {testInfo?.title?.replace(/_/g, " ")}
                  </h1>
                  <Space size="large" className="text-sm text-gray-600">
                    <Text>
                      <ClockCircleFilled style={{ marginRight: 4 }} /> {testInfo?.timeLimit} minutes
                    </Text>
                    <Text>
                      <QuestionCircleFilled style={{ marginRight: 4 }} /> {testInfo?.numOfQuestions} questions
                      hỏi
                    </Text>
                    <Text>
                      <UnorderedListOutlined style={{ marginRight: 4 }} />
                      {testInfo?.type === "TOEIC" ? "7 parts" : "4 parts"}
                    </Text>
                    <Text>
                      <WechatFilled style={{ marginRight: 4 }} /> {commentOfTest.length} comments
                    </Text>
                    {/* <Text>
                      <TeamOutlined style={{ marginRight: 4 }} /> 1,234 lượt làm
                    </Text> */}
                  </Space>
                </div>
                <Button color="default" variant="text" className="!px-0">
                  <ShareAltOutlined className="text-xl text-shadow-gray-200" />
                </Button>
              </div>

              <HistoryAttempts />

              <Card className="!bg-gradient-to-r !from-blue-50 !to-indigo-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Ready to take the test?
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Official simulated {testInfo?.type} test with {testInfo?.numOfQuestions} questions in {testInfo?.timeLimit} minutes
                    </p>
                    <div className="flex items-start !space-x-4 flex-col md:flex-row md:items-center gap-3 md:gap-0">
                      <Button
                        color="primary"
                        variant="solid"
                        size="large"
                        onClick={handleDoTest}
                      >
                        <CaretRightFilled className="text-xl text-shadow-gray-200" />{" "}
                        Start the test
                      </Button>
                      {/* <Button variant="solid" size="large" className="!bg-[FFFFFF]">
                        <EyeFilled className="text-xl text-shadow-gray-200" /> View answers
                      </Button> */}
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                      <ReadFilled className="text-3xl !text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-1">
                    <BulbFilled className="!text-yellow-600" />
                    <div className="text-sm text-yellow-800">
                      <strong>Note:</strong> Please prepare the full {testInfo?.timeLimit} minutes to complete the test. You can pause and continue later.
                    </div>
                  </div>
                </div>
              </Card>

            </Card>

            {/* comment section */}
            <BoxComment testId={id} />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <RightSider />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeTestPage;