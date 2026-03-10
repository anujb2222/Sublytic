import React, { useContext } from 'react';
import { Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant--design/icons';
import { AuthContext } from '../../context/AuthContext'; // Adjust path if necessary

function UserMenu() {
  const { user, logout } = useContext(AuthContext);

  const menuItems = [
    {
      key: 'profile',
      label: user?.username || 'User',
      icon: <UserOutlined />,
      disabled: true, // Makes it a non-clickable title
    },
    {
      type: 'divider', // Adds a separating line
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: logout, // Call the logout function from context
    },
  ];

  return (
    <Dropdown 
        menu={{ items: menuItems }} 
        placement="bottomRight" 
        arrow
    >
      {/* Display a user icon or the first letter of the username */}
      <Avatar 
        style={{ 
            backgroundColor: '#87d068', 
            cursor: 'pointer' 
        }} 
        icon={user ? null : <UserOutlined />}
      >
        {user ? user.username[0].toUpperCase() : null}
      </Avatar>
    </Dropdown>
  );
}

export default UserMenu;