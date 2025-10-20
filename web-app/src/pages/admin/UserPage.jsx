// UserPage.js
import { Card, Button, Space, Modal, Typography } from 'antd';
import { UserAddOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import UserTable from "../../components/admin/user/UserTable";
import UserFilter from '../../components/admin/user/Filter';
import UserFormModal from '../../components/admin/user/UserFormModal';
// import { retrieveUsers, deleteUser, updateUserStatus } from "../../../slice/users"; // <-- Bạn cần action mới

const { Title } = Typography;

const UserPage = () => {
    const dispatch = useDispatch();
    const [modal, contextHolder] = Modal.useModal();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentUser, setCurrentUser] = useState(null)

    const mockUsers = [
        { "id": 1, "keycloakId": "39f2cc1d-a371-421d-8e5f-e81dfe36f686", "email": "user1@gmail.com", "username": "user1", "roles": ["USER", "ADMIN"], "enabled": true },
        { "id": 2, "keycloakId": "a1b2c3d4-e5f6-7890-1234-abcdef123456", "email": "user2@gmail.com", "username": "user2", "roles": ["USER"], "enabled": true },
        { "id": 3, "keycloakId": "b2c3d4e5-f6a7-8901-b2c3-d4e5f6a7b8c9", "email": "user3@gmail.com", "username": "user3", "roles": ["USER"], "enabled": true },
        { "id": 4, "keycloakId": "c3d4e5f6-a7b8-9012-c3d4-e5f6a7b8c9d0", "email": "user4@gmail.com", "username": "user4", "roles": ["USER", "ADMIN"], "enabled": true },
        { "id": 5, "keycloakId": "d4e5f6a7-b8c9-0123-d4e5-f6a7b8c9d0e1", "email": "user5@gmail.com", "username": "user5", "roles": ["USER"], "enabled": true },
        { "id": 6, "keycloakId": "e5f6a7b8-c9d0-1234-e5f6-a7b8c9d0e1f2", "email": "user6@gmail.com", "username": "user6", "roles": ["USER"], "enabled": true },
        { "id": 7, "keycloakId": "f6a7b8c9-d0e1-2345-f6a7-b8c9d0e1f203", "email": "user7@gmail.com", "username": "user7", "roles": ["USER"], "enabled": true },
        { "id": 8, "keycloakId": "a7b8c9d0-e1f2-3456-a7b8-c9d0e1f20314", "email": "user8@gmail.com", "username": "user8", "roles": ["USER"], "enabled": true },
        { "id": 9, "keycloakId": "b8c9d0e1-f203-4567-b8c9-d0e1f2031425", "email": "user9@gmail.com", "username": "user9", "roles": ["USER"], "enabled": true },
        { "id": 10, "keycloakId": "c9d0e1f2-0314-5678-c9d0-e1f203142536", "email": "user10@gmail.com", "username": "user10", "roles": ["USER"], "enabled": true }
    ];


    const users = mockUsers;

    const [loading, setLoading] = useState(false);
    // State để lưu trữ điều kiện filter
    const [filters, setFilters] = useState({});

    const handleSearch = (values) => {
        console.log("Dữ liệu filter nhận được:", values);
        setLoading(true);
        setFilters(values);
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    const filteredUsers = mockUsers.filter(user => {
        if (filters.searchText && !user.username.includes(filters.searchText) && !user.email.includes(filters.searchText)) {
            return false;
        }
        return true;
    });

    const showDeleteConfirm = (userRecord) => {
        modal.confirm({
            title: `Bạn có chắc muốn xóa người dùng "${userRecord.username}"?`,
            icon: <ExclamationCircleOutlined />,
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Xác nhận Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                console.log('Xóa user:', userRecord.keycloakId);
                // dispatch(deleteUser(userRecord.keycloakId));
            },
        });
    };

    const handleToggleStatus = (userRecord) => {
        const newStatus = !userRecord.enabled; // Tính toán state mới
        const actionText = newStatus ? 'kích hoạt' : 'vô hiệu hóa';

        modal.confirm({
            title: `Xác nhận ${actionText} người dùng?`,
            icon: <ExclamationCircleOutlined />,
            content: `Bạn có chắc muốn ${actionText} người dùng "${userRecord.username}"?`,
            okText: `Xác nhận`,
            cancelText: 'Hủy',
            async onOk() {
                console.log('Dispatch action:', userRecord.keycloakId, newStatus);
                // dispatch(updateUserStatus({ userId: userRecord.keycloakId, enabled: newStatus }));
            },
            onCancel() {
                console.log('Hủy toggle');
            },
        });
    };


    // modal 
    const handleCreateUser = () => {
        setCurrentUser(null); // Đặt current user là null
        setIsModalVisible(true); // Mở modal
    };

    // Mở modal ở chế độ "Cập nhật"
    const handleUpdateUser = (userRecord) => {
        setCurrentUser(userRecord); // Đặt user đang được chọn
        setIsModalVisible(true); // Mở modal
    };

    // Đóng modal
    const handleModalCancel = () => {
        setIsModalVisible(false);
        setCurrentUser(null); // Reset user đang chọn
    };

    const handleModalSubmit = (values) => {
        console.log("Form data received:", values);
        setIsSubmitting(true);

        if (currentUser) {
            console.log("Đang cập nhật user:", currentUser.keycloakId);
        } else {
            console.log("Đang tạo user mới:", values);
        }

        setTimeout(() => {
            setIsSubmitting(false);
            setIsModalVisible(false);
            setCurrentUser(null);
        }, 1000);
    };


    return (
        <Card>
            <Space direction="vertical" style={{ width: '100%' }} size="large">

                <UserFilter
                    onSearch={handleSearch}
                    onAdd={handleCreateUser}
                    loading={loading}
                />

                <UserTable
                    users={filteredUsers}
                    loading={loading}
                    onUpdate={handleUpdateUser}
                    onDelete={showDeleteConfirm}
                    onToggleStatus={handleToggleStatus}
                />

                <UserFormModal
                    visible={isModalVisible}
                    onSubmit={handleModalSubmit}
                    onCancel={handleModalCancel}
                    initialValues={currentUser}
                    loading={isSubmitting}
                />

            </Space>

            {contextHolder}
        </Card>
    );
};

export default UserPage;