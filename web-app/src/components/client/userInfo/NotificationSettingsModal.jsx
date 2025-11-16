import { Modal, Switch, Table, Typography } from "antd";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { retrieveAllNotificationSettings, updateUserNotificationSettings } from "../../../slice/notificationSettings";


const { Text } = Typography;

const NotificationSettingsModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authentication);
  const { settings } = useSelector((state) => state.settings);
  const clientId = user?.sub;

  const [modalSettings, setModalSettings] = useState({ userId: clientId, notificationTypes: [] });

  useEffect(() => {
    if (open) {
      dispatch(retrieveAllNotificationSettings(clientId));
    }
  }, [open, clientId, dispatch]);

  useEffect(() => {
    if (settings) {
      setModalSettings(settings);
    }
  }, [settings]);


  const handleSaveSettings = () => {
    dispatch(updateUserNotificationSettings(modalSettings));
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleSettingChange = (typeName, channel, checked) => {
    setModalSettings(prevSettings => ({
      ...prevSettings,
      notificationTypes: prevSettings.notificationTypes.map(type =>
        type.name === typeName
          ? { ...type, [channel === 'email' ? 'emailEnabled' : 'appEnabled']: checked }
          : type
      )
    }));
  };

  const settingsColumns = [
    {
      title: 'Loại thông báo',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Text style={{ fontWeight: 500 }}>{record.name}</Text><br />
          <Text type="secondary" style={{ fontSize: 13 }}>{record.description}</Text>
        </div>
      )
    },
    {
      title: 'Email',
      dataIndex: 'emailEnabled',
      key: 'email',
      align: 'center',
      render: (checked, record) => (
        <Switch
          checked={checked}
          onChange={(newChecked) => handleSettingChange(record.name, 'email', newChecked)}
        />
      )
    },
    {
      title: 'In-App',
      dataIndex: 'appEnabled',
      key: 'app',
      align: 'center',
      render: (checked, record) => (
        <Switch
          checked={checked}
          onChange={(newChecked) => handleSettingChange(record.name, 'app', newChecked)}
        />
      )
    }
  ];

  return (
    <Modal
      title="Cài đặt thông báo"
      open={open}
      onOk={handleSaveSettings}
      onCancel={handleCancel}
      okText="Lưu thay đổi"
      cancelText="Hủy"
      width={700}
      bodyStyle={{ paddingTop: 16 }}
    >
      <Table
        columns={settingsColumns}
        dataSource={modalSettings?.notificationTypes}
        pagination={false}
        rowKey="name"
      />
    </Modal>
  );
};

export default NotificationSettingsModal;