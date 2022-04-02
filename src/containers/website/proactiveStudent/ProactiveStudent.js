import React from 'react'
import { Layout } from 'antd';
import Sidebar from '../../../components/sidebar/Sidebar';

const { Header, Content } = Layout;

const ProactiveStudent = () => {
  

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar/>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
          ProactiveStudent
          </Content>
        </Layout>
      </Layout>
  )
}

export default ProactiveStudent
