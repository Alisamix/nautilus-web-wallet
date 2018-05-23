import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Route, Link } from 'react-router-dom';
import Home from '../home';
import About from '../about';
import 'antd/dist/antd.css';
import Web3 from 'web3';
import Oyster from '../../oyster/bounty';

const Tx = require('ethereumjs-tx');

const privateKey = new Buffer(
  '716560d7fb3c7b937d9af8a532ff154e583320fc42abc46dfc29e0171a6a38e2',
  'hex',
);

export default class App extends React.Component {
  async componentWillMount() {
    const txtemp = await Oyster.signTx(
      '0x4f805bf6843b6dbd10f9066f27c0cd10fdb444ac',
      '0x0f55366ef4c223acec96d449804bd33d8d2e5282',
      31000,
    ).catch(console.error);
    const tx = new Tx(txtemp);
    tx.sign(privateKey);

    const serializedTx = tx.serialize();
  }

  render() {
    return <div>Test!</div>;
  }
}
