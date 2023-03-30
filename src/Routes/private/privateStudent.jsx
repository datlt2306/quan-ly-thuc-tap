import { any } from 'prop-types';
import React from 'react';
import {  Navigate } from "react-router-dom";
import { getLocal } from '../../ultis/storage';
const PrivateStudent = ({children}) => {
  const {isAdmin} = getLocal()
    return !isAdmin ? children : <Navigate to='/404' />
}
PrivateStudent.propTypes = {
    children: any
  }
export default PrivateStudent;


