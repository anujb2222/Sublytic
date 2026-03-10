import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Spin, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getSubscriptions } from '../services/subscriptionService';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import QuickStats from '../components/dashboard/QuickStats';
import DashboardWidgets from '../components/dashboard/DashboardWidgets';
import RecentSubscriptions from '../components/dashboard/RecentSubscriptions';
import SubscriptionModal from '../components/dashboard/SubscriptionModal';
import DashboardActionBar from '../components/dashboard/DashboardActionBar'; // New import
import './Home.css';

function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      notification.error({ message: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      navigate('/login');
    }
  }, [user, navigate, fetchData]);

  const handleEdit = (sub) => {
    setEditingSub(sub);
    setIsModalVisible(true);
  };

  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Spin spinning={loading} size="large">
      <div className="home-page" style={{ padding: 24 }}>
        <DashboardHeader user={user} logout={logout} />
        <QuickStats subscriptions={filteredSubscriptions} />
        <DashboardActionBar 
          onSearch={(value) => setSearchQuery(value)}
          onAdd={() => {
            setEditingSub(null);
            setIsModalVisible(true);
          }}
        />
        <DashboardWidgets subscriptions={filteredSubscriptions} />
        <RecentSubscriptions subscriptions={filteredSubscriptions} onEdit={handleEdit} />
        <SubscriptionModal
          open={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          initialData={editingSub}
          onSuccess={fetchData}
        />
      </div>
    </Spin>
  );
}

export default HomePage;