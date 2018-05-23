import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import Web3 from 'web3';
import Oyster from '../../../oyster/shl';

class SignData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fee: 0,
      price: 0,
    };

    // Toggle the state every second
  }

  async componentWillMount() {
    this.setState({
      fee: await Oyster.prepareTx(
        this.props.address,
        this.props.data.recipient,
        this.props.data.amount,
      ),
    });
    Oyster.getPriceEth().then(data => this.setState({ price: data[0].price_usd }));
  }

  signData = async () => {
    console.log(`Signing ${this.props.data.recipient} ${this.props.data.amount}`);
    const signedTx = await Oyster.signTx(
      this.props.address,
      this.props.data.recipient,
      this.props.data.amount,
    ).catch(console.error);
    this.props.handleSign(signedTx);
  };

  render() {
    console.log('render signdata');
    const { address, data, amount } = this.props;
    return (
      <div>
        Fee: {this.state.fee} ETH | ${Math.round(this.state.price * this.state.fee * 100) / 100} USD
        <br />Recipient: {data.recipient} | Amount: {data.amount}
        <br />
        <br />
        <Button type="primary" icon="caret-up" onClick={this.signData}>
          Sign and Send Data (FINAL)
        </Button>
      </div>
    );
  }
}

export default SignData;
