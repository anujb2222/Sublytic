import React, { useEffect, useState } from 'react';
import {
  Typography, Row, Col, Card, Statistic, List, Switch, Input, Button, Form, Space
} from 'antd';
import { RiseOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

function WhatIfPage() {
  const [subs, setSubs] = useState([]);
  const [form] = Form.useForm(); // Ant Design's Form hook

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/subscriptions', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSubs(data.map(s => ({ ...s, active: true }))))
      .catch(() => setSubs([]));
  }, []);

  const handleToggle = (toggledSub, checked) => {
    setSubs(currentSubs =>
      currentSubs.map(s => (s.id === toggledSub.id ? { ...s, active: checked } : s))
    );
  };

  const handleAdd = (values) => {
    const { newName, newCost } = values;
    if (!newName || !newCost) return;

    // Create a temporary unique ID for the new "what-if" item
    const tempId = `whatif-${Date.now()}`;
    
    setSubs(currentSubs => [
      ...currentSubs,
      { id: tempId, name: newName, cost: parseFloat(newCost), active: true }
    ]);
    form.resetFields();
  };

  const total = subs.filter(s => s.active).reduce((sum, s) => sum + Number(s.cost), 0);

  return (
    <div className="whatif-page" style={{ padding: 24 }}>
      <Title level={2}>What-If Scenarios</Title>
      <Paragraph type="secondary">
        Toggle your existing subscriptions or add new ones to instantly see the impact on your monthly spend.
      </Paragraph>

      <Row gutter={[24, 24]}>
        {/* Left Column: Toggles and Form */}
        <Col xs={24} md={12}>
          <Card title="Toggle Subscriptions" style={{ marginBottom: 24 }}>
            <List
              itemLayout="horizontal"
              dataSource={subs}
              renderItem={sub => (
                <List.Item
                  actions={[
                    <Switch
                      checked={sub.active}
                      onChange={(checked) => handleToggle(sub, checked)}
                    />
                  ]}
                >
                  <List.Item.Meta
                    title={<Text>{sub.name}</Text>}
                    description={`$${Number(sub.cost).toFixed(2)}`}
                  />
                </List.Item>
              )}
            />
          </Card>

          <Card title="Simulate a New Subscription">
            <Form form={form} onFinish={handleAdd} layout="inline">
              <Form.Item
                name="newName"
                rules={[{ required: true, message: 'Please enter a name' }]}
              >
                <Input placeholder="Subscription Name" style={{ minWidth: 200 }}/>
              </Form.Item>
              <Form.Item
                name="newCost"
                rules={[{ required: true, message: 'Please enter a cost' }]}
              >
                <Input type="number" prefix="$" placeholder="Cost" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                  Add
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Right Column: Total Spend */}
        <Col xs={24} md={12}>
          <Card>
            <Statistic
              title="Simulated Monthly Spend"
              value={total}
              precision={2}
              prefix="$"
              valueStyle={{ fontSize: '3rem', color: '#2a7ae2' }}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default WhatIfPage;
