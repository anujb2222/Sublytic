import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { DollarOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons';
import { calculateStats } from '../../utils/dataProcessor';

function QuickStats({ subscriptions }) {
  const { monthlyCost, totalSpent, renewals, categories } = calculateStats(subscriptions);
  
  return (
    <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
      <Col xs={24} sm={12} lg={6}>
        <Card className="stat-card">
          <Statistic title="Total Spent" value={totalSpent} precision={2} prefix="$" suffix="USD" />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card className="stat-card">
          <Statistic title="Monthly Cost" value={monthlyCost} precision={2} prefix="$" suffix="USD" />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card className="stat-card">
          <Statistic title="Upcoming Renewals" value={renewals} prefix={<CalendarOutlined />} />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card className="stat-card">
          <Statistic title="Categories" value={categories} prefix={<TeamOutlined />} />
        </Card>
      </Col>
    </Row>
  );
}

export default QuickStats;