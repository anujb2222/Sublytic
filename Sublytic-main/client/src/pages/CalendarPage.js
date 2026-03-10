import React, { useEffect, useState, useContext } from 'react';
import RenewalCalendar from '../components/RenewalCalendar';
import { Card, Typography, Row, Col, Spin, notification } from 'antd';
import { AuthContext } from '../context/AuthContext';
import { getSubscriptions } from '../services/subscriptionService';

const { Title } = Typography;

function CalendarPage() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await getSubscriptions();
          setSubs(data);
        } catch (error) {
          notification.error({ message: 'Failed to load calendar data' });
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  return (
    <div className="calendar-page" style={{ padding: 24 }}>
      <Row justify="center">
        <Col xs={24} md={20} lg={16} xl={12}>
          <Title level={2} style={{ marginBottom: 24 }}>
            Subscription Renewal Calendar
          </Title>
          <Spin spinning={loading}>
            <Card>
              {/* Pass the live subscription data to your calendar component */}
              <RenewalCalendar subscriptions={subs} />
            </Card>
          </Spin>
        </Col>
      </Row>
    </div>
  );
}

export default CalendarPage;