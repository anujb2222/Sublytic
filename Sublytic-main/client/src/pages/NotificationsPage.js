import React, { useState, useContext } from 'react';
import { List, Switch, Typography, Divider, Card, Tag } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { NotificationsContext } from '../context/NotificationsContext';
import { formatDistanceToNow } from 'date-fns';

const { Title, Text, Paragraph } = Typography;

function NotificationsPage() {
  const { notifications, unreadCount } = useContext(NotificationsContext);

  // The original static state for notification rules
  const [rules, setRules] = useState([
    { id: 1, label: 'Notify me 3 days before a subscription renewal', enabled: true },
    { id: 2, label: 'Notify me when a subscription is added or removed', enabled: false },
    { id: 3, label: 'Notify me if a subscription cost increases', enabled: false },
    { id: 4, label: 'Send me a monthly summary email', enabled: true },
  ]);

  const toggleRule = (id) => {
    // This is where you would call the backend API to save the setting
    // const ruleToUpdate = rules.find(r => r.id === id);
    // updateNotificationSetting(ruleToUpdate);
    
    setRules(currentRules =>
      currentRules.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  return (
    <div className="notifications-page" style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}><BellOutlined /> Notifications & Alerts</Title>
      <Paragraph type="secondary">
        Manage how and when you receive notifications about your subscriptions.
      </Paragraph>
      <Divider />

      <Card title="Notification Settings" style={{ marginBottom: 24 }}>
        <List
          itemLayout="horizontal"
          dataSource={rules}
          renderItem={rule => (
            <List.Item
              actions={[
                <Switch
                  checked={rule.enabled}
                  onChange={() => toggleRule(rule.id)}
                />
              ]}
            >
              <List.Item.Meta
                title={<Text>{rule.label}</Text>}
              />
            </List.Item>
          )}
        />
        <Paragraph style={{ marginTop: 24, textAlign: 'center' }} type="secondary">
          <em>Note: Notification rules are for demonstration and are not saved.</em>
        </Paragraph>
      </Card>
      
      <Card title="Recent Notifications" extra={<Tag color="blue">{unreadCount} unread</Tag>}>
        {notifications.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={<Text>{item.message}</Text>}
                  description={<Text type="secondary">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</Text>}
                />
              </List.Item>
            )}
          />
        ) : (
          <Paragraph type="secondary" style={{ textAlign: 'center', padding: '1rem' }}>
            No recent notifications.
          </Paragraph>
        )}
      </Card>

    </div>
  );
}

export default NotificationsPage;