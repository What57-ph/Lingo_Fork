import React from 'react';
import { Form, Row, Col, Button, Input, DatePicker, Space, Flex } from 'antd';
import { UserAddOutlined, SearchOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

/**
 * LÀ MỘT COMPONENT CHUYÊN NGHIỆP:
 * 1. Nó "ngu" (dumb): Không tự xử lý logic, chỉ nhận props từ cha.
 * 2. Nó "phát sự kiện": Gọi các hàm props (onSearch, onAdd) khi người dùng tương tác.
 * 3. Nó dùng Form.Item: Để liên kết input với Ant Design Form.
 */
const UserFilter = ({ onSearch, onAdd, loading }) => {
  const [form] = Form.useForm();

  // Khi form submit (bấm Tìm kiếm hoặc Enter)
  const handleFinish = (values) => {
    // Gửi dữ liệu đã được validate lên component cha
    onSearch(values);
  };

  // Khi bấm nút Reset
  const handleReset = () => {
    form.resetFields();
    // Báo cho component cha biết là đã reset, cần fetch lại list gốc
    onSearch({});
  };

  return (
    <Form
      form={form}
      name="user-filter-form"
      onFinish={handleFinish}
      layout="vertical" // Layout vertical tốt hơn cho responsive
    >
      <Row gutter={16} align="bottom">

        {/* === CÁC TRƯỜNG FILTER === */}
        <Col xl={6} md={8} sm={12} xs={24}>
          <Form.Item name="searchText" label="Tìm kiếm">
            {/* - Bỏ Input.Search, dùng Input thường + allowClear cho sạch.
              - Nút Search riêng (htmlType="submit") sẽ kích hoạt onFinish.
            */}
            <Input
              placeholder="Theo username, email..."
              allowClear
              prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            />
          </Form.Item>
        </Col>

        <Col xl={6} md={8} sm={12} xs={24}>
          <Form.Item name="dateRange" label="Ngày tạo">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        {/* === CÁC NÚT HÀNH ĐỘNG === */}
        {/* - Dùng Col với flex-grow: 1 để nó chiếm hết phần còn lại.
          - Dùng <Flex> để đẩy các nhóm nút ra 2 bên.
        */}
        <Col xl={12} md={8} sm={24} xs={24} style={{ flexGrow: 1 }}>
          <Form.Item label=" "> {/* Label rỗng để căn chỉnh thẳng hàng */}
            <Flex justify="space-between" align="center" gap="middle" wrap="wrap">

              {/* Nút Tạo mới (ưu tiên bên trái) */}


              {/* Nút Lọc (bên phải) */}
              <Space wrap>
                <Button onClick={handleReset} disabled={loading}>
                  Reset
                </Button>
                <Button
                  type="primary"
                  htmlType="submit" // Đây là cách submit form chuẩn
                  loading={loading}
                  ghost // Dùng 'ghost' cho nút search phụ
                >
                  Tìm kiếm
                </Button>
              </Space>

              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={onAdd}
              >
                Tạo người dùng mới
              </Button>

            </Flex>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default UserFilter;