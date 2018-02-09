import React from 'react';
import { Spin, Row, Col, List, Tag } from 'antd';

const TransactionsWidget = ({ transactions }) => {
  if (transactions) {
    return (
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
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <h3>Incoming</h3>
            <List
              itemLayout="horizontal"
              dataSource={transactions.to}
              renderItem={(transaction) => {
                const URL = `https://etherscan.io/tx/${transaction.transactionHash}`;
                return (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <div>
                          <Tag color="#53B53A">IN</Tag>
                          {'     '}
                          <a target="_blank" href={URL}>
                            {transaction.transactionHash}
                          </a>
                        </div>
                      }
                      description={
                        <Tag color="green">
                          {(transaction.returnValues._value / 1000000000000000000).toLocaleString()}{' '}
                          PRL
                        </Tag>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <h3>Outgoing</h3>
            <List
              itemLayout="horizontal"
              dataSource={transactions.from}
              renderItem={(transaction) => {
                const URL = `https://etherscan.io/tx/${transaction.transactionHash}`;
                return (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <div>
                          <Tag color="#f25252">OUT</Tag>
                          {'     '}
                          <a target="_blank" href={URL}>
                            {transaction.transactionHash}
                          </a>
                        </div>
                      }
                      description={
                        <Tag color="red">
                          {(transaction.returnValues._value / 1000000000000000000).toLocaleString()}{' '}
                          PRL
                        </Tag>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Col>
        </Row>
      </div>
    );
  }
  return (
    <div
      style={{
        padding: 24,
        marginTop: 16,
        background: '#fff',
        minHeight: 360,
      }}
    >
      <Spin tip="Loading Transaction History..." />
    </div>
  );
};

export default TransactionsWidget;
