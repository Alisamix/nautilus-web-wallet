import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const Home = props => (
  <div
    style={{
      padding: 24,
      marginTop: 16,
      background: '#fff',
      minHeight: 360,
    }}
  >
    <h1>Nautilus Wallet Beta</h1>

    <p>
      Hi! This is the Beta of the Nautilus Wallet, allowing you to check your PRL Value and sign
      transactions with your Ledger Nano S.
    </p>
  </div>
);

export default Home;
