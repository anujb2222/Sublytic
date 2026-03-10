import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Space, Popconfirm, Tag, Typography, Row, Col, notification } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import SubscriptionForm from '../components/subscriptions/forms/SubscriptionForm';
import moment from 'moment';

const { Title, Text } = Typography;

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const getSubscriptions = async () => {
  try {
    const response = await axios.get(`${API_BASE}/subscriptions`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch subscriptions');
  }
};

export const createSubscription = async (subscription) => {
  try {
    const response = await axios.post(
      `${API_BASE}/subscriptions`,
      subscription,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create subscription');
  }
};

export const updateSubscription = async (id, subscription) => {
  try {
    const response = await axios.put(
      `${API_BASE}/subscriptions/${id}`,
      subscription,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update subscription');
  }
};

export const deleteSubscription = async (id) => {
  try {
    await axios.delete(`${API_BASE}/subscriptions/${id}`, getAuthHeader());
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete subscription');
  }
};

export const calculateStats = (subscriptions) => {
  const now = new Date();
  const oneMonthFromNow = new Date(now);
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  // Calculate stats
  const totalSpent = subscriptions.reduce((sum, sub) => sum + parseFloat(sub.cost), 0);

  const monthlyCost = subscriptions.reduce((sum, sub) => {
    const cycle = sub.billingCycle.toLowerCase();
    let monthlyValue = parseFloat(sub.cost);

    if (cycle.includes('annual')) monthlyValue /= 12;
    if (cycle.includes('quarter')) monthlyValue /= 3;
    if (cycle.includes('bi')) monthlyValue /= 2;

    return sum + monthlyValue;
  }, 0);

  const categories = [...new Set(subscriptions.map(sub => sub.category))].length;

  // Category breakdown
  const categoryBreakdown = {};
  subscriptions.forEach(sub => {
    const category = sub.category || 'Uncategorized';
    if (!categoryBreakdown[category]) {
      categoryBreakdown[category] = { amount: 0, percentage: 0 };
    }
    categoryBreakdown[category].amount += parseFloat(sub.cost);
  });

  // Calculate percentages
  Object.keys(categoryBreakdown).forEach(category => {
    categoryBreakdown[category].percentage =
      Math.round((categoryBreakdown[category].amount / totalSpent) * 100);
  });

  // Upcoming renewals (next 30 days)
  const upcomingRenewals = subscriptions
    .filter(sub => {
      const renewalDate = new Date(calcNextRenewal(sub.firstBillDate, sub.billingCycle));
      return renewalDate > now && renewalDate <= oneMonthFromNow;
    })
    .map(sub => ({
      id: sub.id,
      name: sub.name,
      date: moment(sub.firstBillDate).format('MMM D'),
      amount: sub.cost
    }))
    .slice(0, 5); // Limit to 5

  // Recent activity (mock for now)
  const recentActivity = [
    { id: 1, action: 'added', name: 'New Service', time: '2 hours ago' },
    { id: 2, action: 'updated', name: 'Existing Service', time: 'Yesterday' }
  ];

  return {
    stats: {
      totalSpent,
      monthlyCost,
      renewals: upcomingRenewals.length,
      categories
    },
    categoryBreakdown,
    upcomingRenewals,
    recentActivity
  };
};

// Helper function used by both frontend and service
function calcNextRenewal(firstBillDate, billingCycle) {
  const now = new Date();
  let next = new Date(firstBillDate);

  while (next < now) {
    if (billingCycle === 'Monthly') next.setMonth(next.getMonth() + 1);
    else if (billingCycle === 'Annually') next.setFullYear(next.getFullYear() + 1);
    else if (billingCycle === 'Quarterly') next.setMonth(next.getMonth() + 3);
    else if (billingCycle === 'Weekly') next.setDate(next.getDate() + 7);
    else break;
  }

  return next;
}

function SubscriptionsPage() {
  const [subs, setSubs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSub, setEditingSub] = useState(null);

  const refreshSubs = async () => {
    try {
      const data = await getSubscriptions();
      setSubs(data);
    } catch (e) {
      setSubs([]);
    }
  };

  useEffect(() => {
    refreshSubs();
  }, []);

  const handleSave = async (sub) => {
    try {
      if (editingSub) {
        await updateSubscription(editingSub.id, sub);
      } else {
        await createSubscription(sub);
      }
      refreshSubs();
      notification.success({ message: `Subscription ${editingSub ? 'updated' : 'added'} successfully!` });
    } catch (e) {
      notification.error({ message: 'Failed to save subscription' });
    }
    setIsModalVisible(false);
    setEditingSub(null);
  };

  const handleEdit = (subscription) => {
    setEditingSub(subscription);
    setIsModalVisible(true);
  };

  const handleDelete = async (subscriptionId) => {
    try {
      await deleteSubscription(subscriptionId);
      refreshSubs();
      notification.success({ message: 'Subscription deleted successfully!' });
    } catch (e) {
      notification.error({ message: 'Failed to delete subscription' });
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', render: text => <Text strong>{text}</Text> },
    { title: 'Category', dataIndex: 'category', key: 'category', render: cat => <Tag color="blue">{cat}</Tag> },
    { title: 'Cost', dataIndex: 'cost', key: 'cost', render: cost => `$${Number(cost).toFixed(2)}`, sorter: (a, b) => a.cost - b.cost },
    { title: 'Billing Cycle', dataIndex: 'billingCycle', key: 'billingCycle', render: cycle => <Tag>{cycle}</Tag> },
    { title: 'Usage', dataIndex: 'usageRating', key: 'usageRating', render: usage => <span>{usage ?? '-'}</span> },
    { title: 'Next Renewal', dataIndex: 'nextRenewal', key: 'nextRenewal' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Delete the subscription"
            description="Are you sure you want to delete this subscription?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const subsWithRenewal = (Array.isArray(subs) ? subs : []).map(sub => ({
    ...sub,
    key: sub.id,
    nextRenewal: sub.firstBillDate && sub.billingCycle ? calcNextRenewal(sub.firstBillDate, sub.billingCycle).toLocaleDateString() : ''
  }));

  return (
    <div className="subscriptions-page" style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>Subscriptions</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingSub(null); setIsModalVisible(true); }}>
            Add Subscription
          </Button>
        </Col>
      </Row>
      <Table columns={columns} dataSource={subsWithRenewal} rowKey="id" />
      <Modal
        title={editingSub ? 'Edit Subscription' : 'Add New Subscription'}
        visible={isModalVisible}
        onCancel={() => { setIsModalVisible(false); setEditingSub(null); }}
        footer={null}
        destroyOnClose
      >
        <SubscriptionForm
          onSave={handleSave}
          onClose={() => { setIsModalVisible(false); setEditingSub(null); }}
          initialData={editingSub}
        />
      </Modal>
    </div>
  );
}

export default SubscriptionsPage;