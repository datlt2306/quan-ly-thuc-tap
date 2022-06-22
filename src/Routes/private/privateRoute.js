import React from 'react';
import { Navigate } from 'react-router-dom';
import { getLocal } from '../../ultis/storage';

const PrivateRoute = ({children}) => {
  const user  = getLocal()
  if (!user) {
   return <Navigate to='/login' replace />
  }
  return children
}

export default PrivateRoute;
