import { any } from 'prop-types';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { roles } from '../../ultis';
import { getLocal } from '../../ultis/storage';
const Privateadmin = ({ children }) => {
	const { isAdmin, manager } = getLocal();
	if (isAdmin) {
		return manager?.role === roles.MANAGER ? children : <Navigate to="/404" />;
	}
};
Privateadmin.propTypes = {
	children: any,
};
export default Privateadmin;
