import React, { Component } from 'react';
import { eth } from 'ledgerco';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Web3 from 'web3';
import { Button, Input } from 'antd';
import Oyster from '../../oyster/index';
import { getAddress } from '../../modules/ledger';

class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: this.props.params.address,
      balance: 0.0,
      status: 'Enter your ETH adress',
    };

    // Toggle the state every second
  }

  componentWillMount() {
    Oyster.getBalance(this.state.address).then(balance => this.setState((balance: balance)));
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
        <h2>{`${this.state.address} - ${this.state.balance}`}</h2>
      </div>
    );
  }
}

export default Address;
