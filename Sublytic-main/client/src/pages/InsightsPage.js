import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from 'recharts';
import { Row, Col, Card, Typography, Statistic, List, Alert } from 'antd';
import { RiseOutlined, ArrowUpOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function InsightsPage() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/subscriptions', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSubs(data))
      .catch(() => setSubs([]));
  }, []);

  // Defensive: ensure subs is always an array
  const safeSubs = Array.isArray(subs) ? subs : [];
  
  // Calculate total cost
  const totalCost = safeSubs.reduce((sum, sub) => sum + Number(sub.cost), 0);

  // Pie chart data
  const pieData = safeSubs.map(sub => ({ name: sub.name, value: Number(sub.cost) }));
  const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // Bar chart data
  const billingCycles = Array.from(new Set(safeSubs.map(sub => sub.billingCycle)));
  const barData = billingCycles.map(cycle => ({
    billingCycle: cycle,
    total: safeSubs.filter(sub => sub.billingCycle === cycle).reduce((sum, sub) => sum + Number(sub.cost), 0)
  }));

  // Leaderboard data
  const leaderboard = [...safeSubs].sort((a, b) => Number(b.cost) - Number(a.cost)).slice(0, 5);

  // Suggestions data
  const suggestions = safeSubs.filter(sub => Number(sub.cost) > 20);

  return (
    <div className="insights-page" style={{ padding: '24px' }}>
      <Title level={2}>Insights</Title>
      
      {/* Total Spend Statistic Card */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12} lg={8}>
          <Card>
            <Statistic
              title="Total Monthly Spend"
              value={totalCost}
              precision={2}
              prefix="$"
              suffix="USD"
              valueStyle={{ color: '#3f8600' }}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Spend by Subscription">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Spend by Billing Cycle">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <XAxis dataKey="billingCycle" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      
      {/* Leaderboard and Suggestions Row */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Top Subscriptions (Leaderboard)">
            <List
              dataSource={leaderboard}
              renderItem={(sub, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Text strong>{index + 1}.</Text>}
                    title={<Text>{sub.name}</Text>}
                    description={`${sub.billingCycle}`}
                  />
                  <Text strong>${Number(sub.cost).toFixed(2)}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Suggestions">
            {suggestions.length === 0 ? (
              <Alert message="All subscriptions are under $20/month." type="success" showIcon />
            ) : (
              <List
                dataSource={suggestions}
                renderItem={sub => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Text>Consider reviewing <strong>{sub.name}</strong></Text>}
                      description={`Currently costs $${Number(sub.cost).toFixed(2)} / ${sub.billingCycle}`}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default InsightsPage;