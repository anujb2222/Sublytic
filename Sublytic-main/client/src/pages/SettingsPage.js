import React from 'react';
import {
  Form,
  Input,
  Checkbox,
  Select,
  Button,
  Typography,
  Divider,
  Card,
  Row,
  Col,
  notification
} from 'antd';
import { SaveOutlined, DownloadOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

function SettingsPage() {
  const [form] = Form.useForm();

  const handleSave = (values) => {
    console.log('Form values:', values);
    notification.success({
      message: 'Settings Saved',
      description: 'Your settings have been updated successfully! (Demo only)',
    });
  };

  const handleExport = () => {
    notification.info({
      message: 'Export Started',
      description: 'Your data is being exported as a CSV file. (Demo only)',
    });
  };

  return (
    <div className="settings-page" style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}><UserOutlined /> Account Settings</Title>
      <Text type="secondary">Manage your notification preferences and account details.</Text>
      <Divider />

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="User Preferences">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              initialValues={{
                notifyRenewal: true,
                currency: 'USD',
                email: 'user@example.com' // Pre-fill with user's email
              }}
            >
              <Form.Item
                name="email"
                label="Email for notifications"
                rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
              >
                <Input placeholder="your.email@example.com" />
              </Form.Item>

              <Form.Item name="currency" label="Default Currency">
                <Select style={{ width: 120 }}>
                  <Option value="USD">USD ($)</Option>
                  <Option value="EUR">EUR (€)</Option>
                  <Option value="INR">INR (₹)</Option>
                </Select>
              </Form.Item>

              <Form.Item name="notifyRenewal" valuePropName="checked">
                <Checkbox>Notify me about upcoming renewals</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  Save Settings
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Data Management">
            <Title level={5}>Export Data</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              Download a CSV file of all your current subscriptions for your records.
            </Text>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              Export Subscriptions (CSV)
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default SettingsPage;