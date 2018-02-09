import React from 'react';
import { Spin, Row, Col } from 'antd';
// TODO
const Transaction = ({ transaction }) => (
  <div
    style={{
      padding: 24,
      marginTop: 16,
      background: '#fff',
      minHeight: 360,
    }}
  >
    <h1 style={{ fontSize: 32 }}>Transactions</h1>

    <Row gutter={16}>
      <Col span={12}>
        <h3>Incoming</h3>
      </Col>
      <Col span={12}>
        <h3>Outgoing</h3>
      </Col>
    </Row>
  </div>
);

export default Transaction;
