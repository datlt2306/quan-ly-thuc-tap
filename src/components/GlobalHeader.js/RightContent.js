import { SettingOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Button, Avatar } from 'antd';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router";
import './index.css'
import {logout} from '../../features/authSlice/authSlice'

const Rightcontent = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {infoUser} = useSelector( state => state.auth)
   const handleLogout = () => {
         dispatch(logout())
         navigate('/login')
   }
    const menu = (
        <Menu  >
            <Menu.Item key='userInfo' >
            <SettingOutlined /> <span>Tài khoản</span>
            </Menu.Item>
            <Menu.Item>
                <Button type='text' onClick={handleLogout}>Đăng xuất</Button>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                    3rd menu item
                </a>
            </Menu.Item>
        </Menu>
    );
    return (
        <div style={{
            marginLeft: 'auto',
            paddingRight: '25px'
        }} >
            <Dropdown overlay={menu} placement="bottomLeft" arrow>
                <span>
                 <Avatar size={44} src={infoUser.picture}  />  <span>{infoUser.name}</span>
                </span>
            </Dropdown>

        </div>
    );
}

export default Rightcontent;
