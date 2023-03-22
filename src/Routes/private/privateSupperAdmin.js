import { any } from 'prop-types';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { roles } from '../../ultis';
import { getLocal } from '../../ultis/storage';
const PrivateSupperAdmin = ({ children }) => {
	const { manager } = getLocal();
	return manager?.role === roles.DEV ? children : <Navigate to="/404" />;
};
PrivateSupperAdmin.propTypes = {
	children: any,
};
export default PrivateSupperAdmin;
