import React from 'react';
import { Row, Col, Input, Button, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Search } = Input;

function DashboardActionBar({ onSearch, onAdd }) {
  return (
    <div className="action-bar" style={{ marginBottom: 24 }}>
      <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col flex="auto">
          <Search
            placeholder="Search subscriptions..."
            allowClear
            enterButton={<Button type="primary" icon={<SearchOutlined />}>Search</Button>}
            size="large"
            onSearch={onSearch}
            className="search-input"
          />
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={onAdd}
            className="add-btn"
          >
            Add Subscription
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardActionBar;