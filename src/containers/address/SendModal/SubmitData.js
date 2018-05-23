import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import Web3 from 'web3';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class SubmitData extends React.Component {
  handleSubmitData = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Submit Data: ', values);
        this.props.handleSubmit(values);
      }
    });
  };

  checkAmount = async (rule, value, callback) => {
    // empty
    if (value === '') {
      callback(' ');
    }
    // no negatives
    if (parseFloat(value) <= 0) {
      callback('Incorrect amount!');
    }
    // enough balance
    if (parseFloat(value) > parseFloat(this.props.balance)) {
      callback('Not enough balance!');
    }
    callback();
  };

  checkRecipient = (rule, value, callback) => {
    if (value === '') {
      callback(' ');
    }
    if (Web3.utils.isAddress(value)) {
      callback();
    }
    callback('Not a valid ETH address!');
  };

  render() {
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;

    const recipientError = isFieldTouched('recipient') && getFieldError('recipient');
    const amountError = isFieldTouched('amount') && getFieldError('amount');
    return (
      <Form layout="horizontal" onSubmit={this.handleSubmitData}>
        <FormItem validateStatus={recipientError ? 'error' : ''} help={recipientError || ''}>
          {getFieldDecorator('recipient', {
            rules: [{ validator: this.checkRecipient }],
          })(<Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Recipient address"
          />)}
        </FormItem>
        <FormItem validateStatus={amountError ? 'error' : ''} help={amountError || ''}>
          {getFieldDecorator('amount', {
            rules: [
              {
                validator: this.checkAmount,
              },
            ],
          })(<Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="number"
            placeholder="Amount"
          />)}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
            Send PRL
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedSubmitData = Form.create()(SubmitData);

export default WrappedSubmitData;
