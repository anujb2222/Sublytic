import React, { useMemo } from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
  CalendarOutlined,
  ExperimentOutlined,
  BellOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

// Define menu items outside the component to prevent re-creation on every render
const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/subscriptions', icon: <UnorderedListOutlined />, label: 'Subscriptions' },
  { key: '/insights', icon: <BarChartOutlined />, label: 'Insights' },
  { key: '/calendar', icon: <CalendarOutlined />, label: 'Calendar' },
  { key: '/what-if', icon: <ExperimentOutlined />, label: 'What-If' },
  { key: '/notifications', icon: <BellOutlined />, label: 'Notifications' },
  { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
];

function AppSidebar() {
  const location = useLocation();

  // This logic finds the correct menu key to highlight based on the current URL
  const selectedKey = useMemo(() => {
    const activeItem = menuItems.find(item => location.pathname.startsWith(item.key));
    return activeItem ? activeItem.key : '/';
  }, [location.pathname]);

  return (
    <Sider collapsible style={{ background: '#001529' }}>
      <div style={{ height: '32px', margin: '16px', color: 'white', fontSize: '1.2rem', textAlign: 'center' }}>
        Sublytic
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: <Link to={item.key}>{item.label}</Link>,
        }))}
      />
    </Sider>
  );
}

export default AppSidebar;