import React from 'react';
import { Navigate } from 'react-router-dom';
import { path } from '../../config/path';
import { getLocal } from '../../ultis/storage';

const PrivateRoute = ({ children }) => {
	const user = getLocal();
	if (!user) {
		return <Navigate to={path.LOGIN} replace />;
	}
	return children;
};

export default PrivateRoute;
