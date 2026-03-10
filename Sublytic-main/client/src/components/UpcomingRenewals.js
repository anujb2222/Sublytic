
import React, { useEffect, useState } from 'react';
import { Card, Typography, List } from 'antd';

function UpcomingRenewals() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/subscriptions', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setSubs(data))
      .catch(() => setSubs([]));
  }, []);

  // Defensive: ensure subs is always an array
  const safeSubs = Array.isArray(subs) ? subs : [];
  // Find next 3 upcoming renewals
  const upcoming = safeSubs
    .map(sub => ({ name: sub.name, date: new Date(sub.firstBillDate) }))
    .filter(sub => sub.date >= new Date())
    .sort((a, b) => a.date - b.date)
    .slice(0, 3);

  return (
    <Card
      title={<Typography.Title level={5} style={{ margin: 0, color: '#2a7ae2' }}>Upcoming Renewals</Typography.Title>}
      bordered={false}
      style={{ borderRadius: 12, minHeight: 110, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}
      bodyStyle={{ padding: '1.2rem 1.2rem' }}
    >
      <List
        size="small"
        dataSource={upcoming}
        locale={{ emptyText: 'No upcoming renewals' }}
        renderItem={item => (
          <List.Item style={{ padding: 0 }}>
            <Typography.Text strong>{item.name}</Typography.Text>: {item.date.toLocaleDateString()}
          </List.Item>
        )}
      />
    </Card>
  );
}

export default UpcomingRenewals;
