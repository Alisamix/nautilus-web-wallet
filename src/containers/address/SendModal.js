import React, { Component } from 'react';
import { Modal, Steps, Form, Icon, Input, Button } from 'antd';
import { comm_u2f, eth } from 'ledgerco';
import Oyster from '../../oyster';

import SubmitData from './SendModal/SubmitData';
import SignData from './SendModal/SignData';
import SendData from './SendModal/SendData';

const { Step } = Steps;

/*
1. ENTER_DATA
2. SIGN_DATA
3. CHECK_DATA
4. WAIT_CONFIRMATION
*/

class SendModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: undefined,
      step: 1,
      visible: this.props.visible,
      data: {},
      signedTx: undefined,
      receipt: undefined,
    };

    // Toggle the state every second
  }

  componentDidMount() {
    Oyster.getBalance(this.props.address)
      .then(balance => this.setState({ balance }))
      .catch(error => this.setState({ balance: error }));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ visible: nextProps.visible });
  }

  getIcon = (number) => {
    if (this.state.step > number) {
      return 'finish';
    } else if (this.state.step === number) {
      return 'process';
    }
    return 'wait';
  };

  getCurrentStep() {
    switch (this.state.step) {
      case 1:
        return <SubmitData balance={this.state.balance} handleSubmit={this.handleSubmitData} />;
      case 2:
        return (
          <SignData
            data={this.state.data}
            handleSign={this.handleSignData}
            address={this.props.address}
          />
        );
      case 3:
        return <SendData tx={this.state.signedTx} handleSend={this.handleSendData} />;
      default:
        return 'Error! You should never see this. wow.';
    }
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleSubmitData = (data) => {
    this.setState({ step: 2, data });
  };

  handleSignData = (signedTx) => {
    this.setState({ step: 3, signedTx });
  };

  handleSendData = (receipt) => {
    this.setState({ step: 3, receipt });
  };

  render() {
    return (
      <Modal
        title="Send PRL"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width={900}
      >
        <Steps>
          <Step status={this.getIcon(1)} title="Start" icon={<Icon type="user" />} />
          <Step status={this.getIcon(2)} title="Signing" icon={<Icon type="solution" />} />
          <Step
            status={this.getIcon(3)}
            title="Sending"
            icon={<Icon type={this.state.step === 3 ? 'loading' : 'upload'} />}
          />
        </Steps>
        {this.getCurrentStep()}
      </Modal>
    );
  }
}

export default SendModal;
