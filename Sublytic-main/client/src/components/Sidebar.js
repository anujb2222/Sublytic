
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  UnorderedListOutlined,
  PieChartOutlined,
  CalendarOutlined,
  BulbOutlined,
  BellOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Sider } = Layout;


function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = () => {
    if (location.pathname.startsWith('/dashboard') || location.pathname === '/home') return '/home';
    if (location.pathname.startsWith('/subscriptions')) return '/subscriptions';
    if (location.pathname.startsWith('/insights')) return '/insights';
    if (location.pathname.startsWith('/calendar')) return '/calendar';
    if (location.pathname.startsWith('/whatif')) return '/whatif';
    if (location.pathname.startsWith('/notifications')) return '/notifications';
    if (location.pathname.startsWith('/settings')) return '/settings';
    return location.pathname;
  };
  return (
    <Sider width={220} style={{ minHeight: '100vh', background: '#2a7ae2' }}>
      <div style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', padding: '32px 24px 24px 24px', letterSpacing: 1 }}>
        Sublytic
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey()]}
        style={{ background: '#2a7ae2', borderRight: 0 }}
        onClick={({ key }) => navigate(key)}
        items={[
          {
            key: '/home',
            icon: <HomeOutlined />,
            label: 'Dashboard',
          },
          {
            key: '/subscriptions',
            icon: <UnorderedListOutlined />,
            label: 'Subscriptions',
          },
          {
            key: '/insights',
            icon: <PieChartOutlined />,
            label: 'Insights',
          },
          {
            key: '/calendar',
            icon: <CalendarOutlined />,
            label: 'Calendar',
          },
          {
            key: '/whatif',
            icon: <BulbOutlined />,
            label: 'What-If',
          },
          {
            key: '/notifications',
            icon: <BellOutlined />,
            label: 'Notifications',
          },
          {
            key: '/settings',
            icon: <SettingOutlined />,
            label: 'Settings',
          },
        ]}
      />
    </Sider>
  );
}

export default Sidebar;
