import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Route, Link } from 'react-router-dom';
import Home from '../home';
import About from '../about';
import 'antd/dist/antd.css';

export default class App extends React.Component {
  state = {
    collapsed: false,
  };
  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };
  render() {
    return <div>Test!</div>;
  }
}
