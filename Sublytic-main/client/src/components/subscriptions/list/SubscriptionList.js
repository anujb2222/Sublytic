
import { List, Card, Button, Typography, Space, Empty } from 'antd';

function SubscriptionList({ subscriptions, onEdit, onDelete }) {
  return (
    <div className="subscription-list" style={{ background: 'none', boxShadow: 'none', padding: 0, marginBottom: 0 }}>
      {subscriptions.length === 0 ? (
        <Empty description="No subscriptions found." />
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={subscriptions}
          renderItem={(sub, idx) => (
            <List.Item key={sub.id || idx}>
              <Card
                title={<Typography.Text strong>{sub.name}</Typography.Text>}
                extra={<Typography.Text type="secondary">{sub.category}</Typography.Text>}
                style={{ borderRadius: 10 }}
              >
                <div style={{ marginBottom: 8 }}>
                  <Typography.Text>${sub.cost} / {sub.billingCycle}</Typography.Text>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Typography.Text type="secondary">Next Renewal: {sub.nextRenewal}</Typography.Text>
                </div>
                <Space>
                  <Button size="small" type="primary" onClick={() => onEdit(idx)}>
                    Edit
                  </Button>
                  <Button size="small" danger onClick={() => onDelete(idx)}>
                    Delete
                  </Button>
                </Space>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}

export default SubscriptionList;
