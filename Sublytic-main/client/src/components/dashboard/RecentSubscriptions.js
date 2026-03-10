import React from 'react';
import { Card, List, Button, Avatar, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

function RecentSubscriptions({ subscriptions, onEdit }) {
  const navigate = useNavigate();
  return (
    <Card
      title="Recent Subscriptions"
      extra={<Button type="primary" onClick={() => navigate('/subscriptions')}>View All</Button>}
    >
      <List
        itemLayout="horizontal"
        dataSource={subscriptions.slice(0, 4)}
        renderItem={(item) => (
          <List.Item
            actions={[<Button type="link" onClick={() => onEdit(item)}>Details</Button>]}
          >
            <List.Item.Meta
              avatar={<Avatar>{item.name.charAt(0)}</Avatar>}
              title={<Text strong>{item.name}</Text>}
              description={`$${item.cost} / ${item.billingCycle}`}
            />
          </List.Item>
        )}
      />
    </Card>
  );
}

export default RecentSubscriptions;