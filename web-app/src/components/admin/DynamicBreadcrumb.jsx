// src/components/admin/DynamicBreadcrumb.jsx
import React from 'react';
import { Breadcrumb, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';


const breadcrumbNameMap = {
  '/admin': 'Dashboard',
  '/admin/tests': 'Danh sách bài thi',
  '/admin/create-test': 'Tạo bài thi mới',
  '/admin/question-bank': 'Ngân hàng câu hỏi',
  '/admin/users': 'Quản lý người dùng',
  '/admin/analytics': 'Thống kê & Báo cáo',
  '/admin/settings': 'Cài đặt chung',
};

const DynamicBreadcrumb = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const name = breadcrumbNameMap[url];

    if (!name) return null;

    const isLast = index === pathSnippets.length - 1;
    return (
      <Breadcrumb.Item key={url}>
        {isLast ? (
          <Typography.Text strong>{name}</Typography.Text>
        ) : (
          <Link to={url}>{name}</Link>
        )}
      </Breadcrumb.Item>
    );
  }).filter(item => item !== null);

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/admin">
        <HomeOutlined />
      </Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <Breadcrumb style={{ marginBottom: '24px' }}>
      {breadcrumbItems}
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;