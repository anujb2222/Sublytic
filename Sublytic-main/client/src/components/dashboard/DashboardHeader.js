import React, { useContext } from 'react';
import { Row, Col, Typography, Space, Badge, Button, Dropdown, Avatar } from 'antd';
import { BellOutlined, SettingOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { NotificationsContext } from '../../context/NotificationsContext';// Import the context

const { Title, Text } = Typography;

function DashboardHeader({ user, logout }) {
  const navigate = useNavigate();
  // Use the useContext hook to get the unreadCount from the NotificationsContext
  const { unreadCount } = useContext(NotificationsContext); 
  const menuItems = [
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings', onClick: () => navigate('/settings') },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true, onClick: logout }
  ];

  return (
    <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
      <Col>
        <Title level={2} style={{ margin: 0 }}>
          Hello, {user?.username} 👋
        </Title>
        <Text type="secondary">Here's an overview of your subscriptions.</Text>
      </Col>
      <Col>
        <Space size="large">
          <Badge count={unreadCount}> {/* Change the static value to the dynamic unreadCount */}
            <Button
              shape="circle"
              icon={<BellOutlined />}
              onClick={() => navigate('/notifications')}
            />
          </Badge>
          <Dropdown menu={{ items: menuItems }} placement="bottomRight">
            <Avatar src={`https://i.pravatar.cc/150?u=${user?.username}`} style={{ cursor: 'pointer' }} />
          </Dropdown>
        </Space>
      </Col>
    </Row>
  );
}

export default DashboardHeader;