import React from 'react';
import { Button, Icon } from 'antd';

const LedgerButton = ({
  loading, error, address, getAddress,
}) => {
  if (error) {
    return (
      <Button icon="close" type="danger" size="large" loading={false} onClick={() => getAddress(5)}>
        {error}
      </Button>
    );
  }
  return (
    <Button
      type={address ? 'dashed' : 'primary'}
      size="large"
      icon={address ? 'check' : null}
      loading={loading}
      onClick={() => getAddress(5)}
    >
      {address ? 'Connected to Ledger' : 'Connect to Ledger'}
    </Button>
  );
};

export default LedgerButton;
