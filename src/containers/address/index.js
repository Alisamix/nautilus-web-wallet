import React, { Component } from 'react';
import { Breadcrumb, Button, notification, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import Oyster from '../../oyster/index';
import CopyToClipboard from 'react-copy-to-clipboard';
import TransactionsWidget from './TransactionsWidget';
import WrappedSendModal from './SendModal';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  // the default value for minimumFractionDigits depends on the currency
  // and is usually already 2
});
const openClipboardNotification = () => {
  Oyster.lock();
  notification.open({
    message: 'Copied to clipboard!',
    description: 'Your address is in your clipboard.',
  });
};

class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: props.match.params.address,
      balance: 0.0,
      price: undefined,
      visible: false,
      transactions: null,
    };

    // Toggle the state every second
  }

  componentWillMount() {
    Oyster.getTransactions(this.state.address)
      .then((transactions) => {
        console.log(transactions);
        this.setState({ transactions });
      })
      .catch(error => console.error(error));

    Oyster.getBalance(this.state.address)
      .then(balance => this.setState({ balance }))
      .catch(error => this.setState({ balance: error }));

    Oyster.getPrice().then(data => this.setState({ price: data[0].price_usd }));
  }

  openModal = () => {
    this.setState({ visible: true });
  };

  render() {
    console.log(this.state.price);
    return (
      <Col>
        <Row gutter={16}>
          <div
            style={{
              padding: 24,
              marginTop: 16,
              background: '#fff',
              minHeight: 360,
            }}
          >
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/">Home</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/wallet/">Wallet</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{this.state.address}</Breadcrumb.Item>
            </Breadcrumb>
            <WrappedSendModal
              visible={this.state.visible}
              address={this.props.match.params.address}
            />
            <br />
            <h4>
              {this.state.price ? formatter.format(this.state.price * this.state.balance) : null}
            </h4>
            <h1 style={{ fontSize: 32 }}>{`${this.state.balance}  PRL`}</h1>

            <Button.Group size="large">
              <Button type="primary" icon="caret-up" onClick={this.openModal}>
                Send PRL
              </Button>{' '}
              <CopyToClipboard text={this.state.address} onCopy={openClipboardNotification}>
                <Button icon="file">Copy Address</Button>
              </CopyToClipboard>
            </Button.Group>
          </div>
        </Row>
        <Row>
          <TransactionsWidget transactions={this.state.transactions} />
        </Row>
      </Col>
    );
  }
}

export default Address;
