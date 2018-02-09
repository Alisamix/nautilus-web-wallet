import React, { Component } from 'react';
import { eth } from 'ledgerco';
import { push } from 'react-router-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tag, List, Icon } from 'antd';
import { getAddress } from '../../modules/ledger';
import LedgerButton from './ledgerButton';

class Wallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: undefined,
    };

    // Toggle the state every second
  }

  render() {
    return (
      <div
        style={{
          padding: 24,
          marginTop: 16,
          background: '#fff',
          minHeight: 360,
        }}
      >
        <LedgerButton
          address={this.props.address}
          getAddress={this.props.getAddress.bind(this)}
          loading={this.props.loading}
          error={this.props.error}
        />

        <List
          itemLayout="horizontal"
          dataSource={this.props.address}
          renderItem={(item, id) => (
            <List.Item>
              <List.Item.Meta
                extra={<Icon type="folder" />}
                title={
                  <h3>
                    <Link to={`/wallet/${item.address}`}>{item.address}</Link>
                  </h3>
                }
                description={<Tag color="blue">{`m/44'/60'/0/${id}`}</Tag>}
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  address: state.ledger.address,
  error: state.ledger.error,
  loading: state.ledger.loading,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getAddress,
      changePage: () => push('/about-us'),
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
