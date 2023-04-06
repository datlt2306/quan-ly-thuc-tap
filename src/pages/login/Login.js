import React, { useEffect, useState } from 'react';
import styles from './Login.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { loginGoogle } from '../../features/authSlice/authSlice';
import { Select, message } from 'antd';
import { useNavigate } from 'react-router';
import { getListCumpus } from '../../features/cumpusSlice/cumpusSlice';
import { defaultTime } from '../../features/semesters/semestersSlice';
import { GoogleLogin } from '@react-oauth/google';
const { Option } = Select;

const Login = () => {
	const dispatch = useDispatch();
	const [campus, setCampus] = useState('');
	const navigate = useNavigate();
	const { listCumpus } = useSelector((state) => state.cumpus);

	const handleFailure = (err) => {
		message.error(err);
	};

	const handleLogin = (credentialResponse) => {
		dispatch(
			defaultTime({
				filter: { campus_id: campus },
				callback: (data) => {
					if (data.status === 'ok') {
						const dataForm = {
							token: credentialResponse.credential,
							cumpusId: campus,
							smester_id: data?.result?._id,
						};
						dispatch(loginGoogle({ val: dataForm, callback: callbackRedirect }));
					}
				},
			})
		);
	};

	const callbackRedirect = (payload) => {
		const { isAdmin, manager } = payload;
		if (!payload?.success) {
			message.error('Đăng nhập thất bại');
			return;
		}

		message.success('Đăng nhập thành công');

		return isAdmin
			? manager.role === 2
				? navigate('/employee-manager')
				: navigate('/status')
			: navigate('/info-student');
	};

	const handleChange = (value) => {
		setCampus(value);
	};

	useEffect(() => {
		dispatch(getListCumpus());
	}, [dispatch]);

	return (
		<div className={styles.login_wrapper}>
			<img
				alt="LOGO"
				className={styles.logo}
				src="https://career.fpt.edu.vn/Content/images/logo_unit/Poly.png"
			/>
			<div>
				<Select
					className={styles.campus}
					defaultValue="Lựa chọn cơ sở"
					onChange={handleChange}
				>
					{listCumpus &&
						listCumpus.map((item, index) => (
							<Option key={index} value={item._id}>
								{item.name}
							</Option>
						))}
				</Select>
			</div>
			<div
				style={{
					margin: '1rem',
					pointerEvents: campus ? 'all' : 'none',
					opacity: campus ? 1 : 0.5,
				}}
			>
				<GoogleLogin
					theme={campus ? 'filled_blue' : 'outline'}
					size="large"
					text="Đăng nhập bằng Google"
					onSuccess={handleLogin}
					onError={handleFailure}
				/>
			</div>
		</div>
	);
};

export default Login;
