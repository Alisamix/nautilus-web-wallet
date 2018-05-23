import React from 'react';
import { Timeline, Icon } from 'antd';
import Web3 from 'web3';
import Oyster from '../../../oyster/shl';

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/MldaSaQTIYCEHoOy7EHM'));
class SendData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionHash: undefined,
      receipt: undefined,
      error: undefined,
    };

    // Toggle the state every second
  }

  sendData = () => {
    console.log('Sending ', this.props.tx);
    web3.eth
      .sendSignedTransaction(`0x${this.props.tx.toString('hex')}`)
      .once('transactionHash', (transactionHash) => {
        this.setState({ transactionHash });
      })
      .once('receipt', (receipt) => {
        this.setState({ receipt });
      })
      .then(receipt => this.props.handleSend(receipt));
  };

  render() {
    console.log('render senddata');
    this.sendData();

    const { transactionHash, receipt } = this.state;
    return (
      <div>
        <Timeline>
          <Timeline.Item>Sent transaction...</Timeline.Item>
          {transactionHash ? (
            <Timeline.Item>Transaction Hash: {transactionHash}</Timeline.Item>
          ) : null}
          {receipt ? <Timeline.Item>Receipt received! :)</Timeline.Item> : null}
        </Timeline>
      </div>
    );
  }
}

export default SendData;
