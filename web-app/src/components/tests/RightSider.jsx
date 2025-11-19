import { Avatar, Button, Card } from "antd";
import { CustomerServiceOutlined, StarFilled, UserOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { retrieveUserMaxScore, retrieveUserTotalTest } from "../../slice/attempts";

const RightSider = () => {
  const { user } = useSelector((state) => state.authentication);
  const { totalTests, maxScore } = useSelector((state) => state.attempts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.sub) {
      dispatch(retrieveUserMaxScore(user.sub));
      dispatch(retrieveUserTotalTest(user.sub));
    }
  }, [dispatch, user?.sub]);


  return (
    <>
      <Card className="!shadow-lg !pb-3">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="!bg-red-500" icon={<UserOutlined />} />
          <div>
            <h3 className="font-semibold text-gray-900">{user?.preferred_username}</h3>
            <p className="text-sm text-gray-600">Level 12 • 2,450 XP</p>
          </div>
        </div>
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4 mt-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalTests ?? 0}</div>
              <div className="text-xs text-gray-600">Total tests</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{maxScore ?? 0.0}</div>
              <div className="text-xs text-gray-600">Highest point</div>
            </div>
          </div>
          <div className="flex space-x-2 mb-4">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <StarFilled className="!text-gray-100" />
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <StarFilled className="!text-gray-100" />
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <StarFilled className="!text-gray-100" />
            </div>
          </div>
          <Button block color="primary" variant="solid" size="large" onClick={() => navigate("/analytics")}>
            Xem thống kê
          </Button>
        </div>
      </Card>
    </>
  )
}

export default RightSider;
