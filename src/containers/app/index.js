import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import 'antd/dist/antd.css';
import Home from '../home';

import Wallet from '../wallet';
import Address from '../address';
import Logo from '../../logogradient.png';

const {
  Header, Content, Footer, Sider,
} = Layout;
const SubMenu = Menu.SubMenu;

class App extends React.Component {
  state = {
    collapsed: false,
  };
  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div
            className="logo"
            style={{
              height: 100,
              backgroundImage: `url(${Logo})`,
              margin: 16,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />

          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
              {' '}
              <NavLink to="/" style={{ textDecoration: 'none' }}>
                <Icon type="pie-chart" />
                <span>Home</span>
              </NavLink>
            </Menu.Item>

            <Menu.Item key="2">
              {' '}
              <NavLink to="/wallet">
                <Icon type="desktop" />
                <span>Ledger Wallet</span>{' '}
              </NavLink>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#1e3d5a', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Route exact path="/" component={Home} />

            <Route exact path="/wallet" component={Wallet} />
            <Route path="/wallet/:address" component={Address} />
          </Content>
          <Footer style={{ textAlign: 'center' }}>Nautilus Wallet ©2018 Created by Ali K</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;
/*
<SubMenu
  key="sub1"
  title={
    <span>
      <Icon type="user" />
      <span>Saved addresses</span>
    </span>
  }
>
  <Menu.Item key="4">0x0f55366ef4c223aceC96d449804Bd33D8D2e5282</Menu.Item>
  <Menu.Item key="5">0x1F7a7cEAaCf7e4EDF18aB34CB2570e71612AE5cb</Menu.Item>
</SubMenu>
<SubMenu
  key="sub2"
  title={
    <span>
      <Icon type="team" />
      <span>Team</span>
    </span>
  }
>
  <Menu.Item key="6">Team 1</Menu.Item>
  <Menu.Item key="8">Team 2</Menu.Item>
</SubMenu>
<Menu.Item key="9">
  <Icon type="file" />
  <span>File</span>
</Menu.Item> */
