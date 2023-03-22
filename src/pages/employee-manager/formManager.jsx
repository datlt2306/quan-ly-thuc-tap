import { Form, Input, Button, Select } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import { roles } from '../../ultis';
import { getLocal } from '../../ultis/storage';
const { Option } = Select;
const FormManager = ({ onFinish, forms, listCumpus, current }) => {
	const onFinishForm = (values) => {
		const { campus_id } = getLocal().manager;
		const data = _.size(current)
			? {
					...values,
					id: current._id,
			  }
			: {
					...values,
					campus_id: role === 1 ? campus_id : values.campus_id,
			  };
		onFinish(data);
	};

	const [role, setRole] = useState(1);
	return (
		<>
			<Form
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 14 }}
				form={forms}
				onFinish={onFinishForm}
			>
				<Form.Item
					name="name"
					label="Tên"
					validateTrigger="onBlur"
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập tên nhân viên!',
						},
					]}
				>
					<Input placeholder="Nhập tên nhân viên!" />
				</Form.Item>

				<Form.Item
					name="email"
					label="Email "
					validateTrigger="onBlur"
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập Email nhân viên!',
						},
					]}
				>
					<Input type="email" placeholder="Nhập Email nhân viên!" />
				</Form.Item>

				<Form.Item name="role" label="Chức vụ">
					<Select onChange={(val) => setRole(val)} placeholder="Chọn chức vụ">
						<Option value={roles.MANAGER}>Nhân viên </Option>
						<Option value={roles.DEV}>Quản lý </Option>
					</Select>
				</Form.Item>

				{role === roles.DEV && (
					<Form.Item
						name="campus_id"
						label="Cơ sở "
						validateTrigger="onBlur"
						rules={[
							{
								required: true,
								message: 'Vui lòng chọn cơ sở nhân viên!',
							},
						]}
					>
						<Select placeholder="Chọn cơ sở nhân viên!">
							{listCumpus.map((item, index) => {
								return (
									<Option key={index} value={item._id}>
										{item.name}
									</Option>
								);
							})}
						</Select>
					</Form.Item>
				)}
				<Form.Item style={{ marginLeft: '20px' }}>
					<Button type="primary" htmlType="submit">
						Xác nhận
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default FormManager;
