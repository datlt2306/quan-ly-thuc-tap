import { any } from 'prop-types';
import React from 'react';
import {  Navigate } from "react-router-dom";
import { getLocal } from '../../ultis/storage';
const PrivateSupperAdmin = ({children}) => {
  const {manager} = getLocal()
  console.log(manager)
    return manager?.role === 2 ? children : <Navigate to='/404' />
}
PrivateSupperAdmin.propTypes = {
    children: any
  }
export default PrivateSupperAdmin;


