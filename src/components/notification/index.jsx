import { notification } from 'antd';
import { any, string } from 'prop-types';
// eslint-disable-next-line no-unused-vars
import React, { memo } from 'react';

const Notification = ({type, message}) => {
    const noti = (type)=>{
         return  notification[type]({
            message: message,
            style: {
                width: 250,
                height: 60,
                marginTop: 50,
                color: "#FFFFFF",
                background: "#4BB543",
              },
              duration: 1.5,
          })
    }
    return (noti(type))
    
}
Notification.propTypes = {
    type: any,
    message: string
}
export default memo(Notification);
