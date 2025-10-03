import { Button, Card, Col, Row, Space, Typography } from "antd"
import {
  CaretRightOutlined, CheckCircleFilled, CheckCircleOutlined, ClockCircleFilled,
  QuestionCircleFilled,
  StarFilled, UserOutlined
} from '@ant-design/icons';
import { useSelector } from "react-redux";
import { selectMergedTests } from "../../../store/selectors";
import { useNavigate } from "react-router-dom";

const TestItem = () => {
  const { Text } = Typography;
  const mergedTests = useSelector(selectMergedTests);

  // console.log(mergedTests);
  const navigate = useNavigate();



  const Item = ({ attempts = "100", category = "Toeic", timeLimit, finish = false, id, questions = '200', title, type }) => {

    const slugify = (str) => {
      return str
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
    };

    const fixTitle = (title) => title.split('_').join(' ');

    const handleButton = () => {
      const slug = slugify(title);
      navigate(`/tests/${id}/${slug}`);
    }

    return (
      <Col xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
      >
        <Card
          className="shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ padding: 8, display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div className="flex flex-wrap items-start justify-between">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{category || 'TOEIC'}</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{type}</span>
            </div>

            {finish && <CheckCircleFilled className=" !text-green-500 !text-xl mt-1" />}
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-4 hover:text-blue-600 ">
            {fixTitle(title)}
          </h3>

          <Row gutter={[16, 16]} className="mb-6 text-gray-600" style={{ flex: "0 0 auto" }}>
            <Col span={12}>
              <Space>
                <ClockCircleFilled className="!text-blue-500" />
                <Text>{timeLimit} phút</Text>
              </Space>
            </Col>
            <Col span={12}>
              <Space>
                <QuestionCircleFilled className="!text-green-500" />
                <Text>{questions} câu</Text>
              </Space>
            </Col>
            <Col span={12}>
              <Space>
                <UserOutlined className="!text-orange-500" />
                <Text>{attempts} lượt</Text>
              </Space>
            </Col>
          </Row>

          <div style={{ marginTop: "auto" }}>
            <Button
              color="primary" variant="outlined"
              block
              size="large"
              icon={<CaretRightOutlined />}
              onClick={handleButton}
            >
              {finish ? "Xem kết quả" : "Vào thi"}
            </Button>
          </div>
        </Card>
      </Col>
    )
  }

  return (
    <Row gutter={[16, 16]}>
      {
        mergedTests.map((item) => {
          return (
            <Item key={item.id} {...item} />
          )
        })
      }
    </Row>
  )
}
export default TestItem