import {  Row, Col } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import React from 'react';
import Rightcontent from './RightContent';
import './index.css'
const GlobalHeader = () => {
    return (
        <>
            <Header className="site-layout-background" >
                <Row style={{padding :"0 10px"}}>
                    <Col span={6}>
                        {
                            window.innerWidth <= 1024 ?
                                <div className="logo-school logo-mobile">
                                    <div className="logo">
                                        <img
                                            style={{ width: "70%", height: "70%",marginTop:10 }}
                                            src="https://upload.wikimedia.org/wikipedia/commons/2/20/FPT_Polytechnic.png"
                                            alt=""
                                        />
                                    </div>
                                </div>
                                :
                                ""
                        }

                    </Col>
                    <Col span={12}></Col>
                    <Col style={{
                        display: 'flex', justifyContent: 'flex-end'
                    }} span={6}>
                        <Rightcontent />
                    </Col>
                </Row>

            </Header>
        </>
    );
}

export default GlobalHeader;
