import React from 'react';
import { Form, Input, Button, Select, DatePicker, Slider, Space } from 'antd';
import moment from 'moment';

const { Option } = Select;

function SubscriptionForm({ onSave, onClose, initialData }) {
  const [form] = Form.useForm();

  // This sets the initial form values when editing a subscription
  const initialValues = initialData ? {
    ...initialData,
    firstBillDate: initialData.firstBillDate ? moment(initialData.firstBillDate) : null
  } : {
    billingCycle: 'Monthly',
    category: 'Entertainment',
    usageRating: 5
  };

  const handleSubmit = (values) => {
    // Format the date correctly before saving
    const formattedValues = {
      ...values,
      firstBillDate: values.firstBillDate.format('YYYY-MM-DD')
    };
    onSave(formattedValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
    >
      <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter a name' }]}>
        <Input placeholder="e.g. Netflix" />
      </Form.Item>

      <Form.Item name="category" label="Category" rules={[{ required: true }]}>
        <Select>
          <Option value="Entertainment">Entertainment</Option>
          <Option value="Software">Software</Option>
          <Option value="Music">Music</Option>
          <Option value="Shopping">Shopping</Option>
          <Option value="News">News</Option>
          <Option value="Other">Other</Option>
        </Select>
      </Form.Item>

      <Form.Item name="cost" label="Cost" rules={[{ required: true, message: 'Please enter a cost' }]}>
        <Input type="number" prefix="$" min="0" step="0.01" />
      </Form.Item>

      <Form.Item name="billingCycle" label="Billing Cycle" rules={[{ required: true }]}>
        <Select>
          <Option value="Monthly">Monthly</Option>
          <Option value="Annually">Annually</Option>
          <Option value="Quarterly">Quarterly</Option>
          <Option value="Weekly">Weekly</Option>
        </Select>
      </Form.Item>

      <Form.Item name="firstBillDate" label="First Bill Date" rules={[{ required: true, message: 'Please select a date' }]}>
        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="notes" label="Notes (optional)">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item name="usageRating" label="Usage Rating (1-10)">
        <Slider min={1} max={10} />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">Save</Button>
          <Button onClick={onClose}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default SubscriptionForm;