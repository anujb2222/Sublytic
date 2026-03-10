import React from 'react';
import { Row, Col, Card, Typography, Button, Progress, Space, List, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SyncOutlined, EyeOutlined } from '@ant-design/icons';
import { calculateCategoryBreakdown, calculateUpcomingRenewals } from '../../utils/dataProcessor';

const { Text } = Typography;

function DashboardWidgets({ subscriptions }) {
  const navigate = useNavigate();
  const upcomingRenewals = calculateUpcomingRenewals(subscriptions);
  const categoryBreakdown = calculateCategoryBreakdown(subscriptions);

  const getCategoryColor = (category) => {
    const colors = {
      'Entertainment': 'blue', 'Software': 'purple', 'Music': 'green',
      'News': 'orange', 'Utilities': 'red', 'Productivity': 'cyan'
    };
    return colors[category] || 'geekblue';
  };

  // Re-implementing the recent activity logic directly here for a simple solution
  const recentActivity = subscriptions.slice(-2).reverse().map(sub => ({
    id: sub.id,
    name: sub.name,
    action: 'added', // Placeholder for simplicity
    time: 'Just now' // Placeholder for simplicity
  }));

  return (
    <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
      {/* Upcoming Renewals */}
      <Col xs={24} lg={8}>
        <Card
          title="Upcoming Renewals"
          className="dashboard-card"
          extra={<Button type="link" icon={<SyncOutlined />} onClick={() => navigate('/calendar')} />}
        >
          {upcomingRenewals.length > 0 ? (
            upcomingRenewals.map(item => (
              <div key={item.id} className="renewal-item">
                <div className="renewal-info">
                  <Text strong>{item.name}</Text>
                  <Text type="secondary">{item.date}</Text>
                </div>
                <Text strong>${item.amount}</Text>
              </div>
            ))
          ) : (
            <p>No upcoming renewals in the next month.</p>
          )}
          <Button
            type="link"
            block
            className="view-all"
            onClick={() => navigate('/calendar')}
          >
            View all upcoming renewals
          </Button>
        </Card>
      </Col>
      
      {/* Recent Activity */}
      <Col xs={24} lg={8}>
        <Card
          title="Recent Activity"
          className="dashboard-card"
          extra={<Button type="link" onClick={() => navigate('/activity')}><EyeOutlined /> View All</Button>}
        >
          <List
            itemLayout="horizontal"
            dataSource={recentActivity}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar>{item.name.charAt(0)}</Avatar>}
                  title={<Text strong>You {item.action} {item.name}</Text>}
                  description={<Text type="secondary">{item.time}</Text>}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>

      {/* Spending by Category */}
      <Col xs={24} lg={8}>
        <Card
          title="Spending by Category"
          className="dashboard-card"
          extra={<Button type="link" onClick={() => navigate('/insights')}>Details</Button>}
        >
          {Object.entries(categoryBreakdown).map(([category, data]) => (
            <React.Fragment key={category}>
              <div className="category-item">
                <Text strong>{category}</Text>
                <Space>
                  <Text>${data.amount.toFixed(2)}</Text>
                  <Text type="secondary">{data.percentage}%</Text>
                </Space>
              </div>
              <Progress
                percent={data.percentage}
                strokeColor={getCategoryColor(category)}
                showInfo={false}
              />
            </React.Fragment>
          ))}
          <Button type="link" block className="view-all" onClick={() => navigate('/insights')}>
            View detailed breakdown
          </Button>
        </Card>
      </Col>
    </Row>
  );
}

export default DashboardWidgets;