import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import UpFile from '../components/ExcelDocument/UpFile';
import LayoutWebsite from '../layouts/layoutWebsite';
import Notfound from '../pages/404/404';
import ListOfBusiness from '../pages/business/ListOfBusiness';
import WaitBusiness from '../pages/business/WaitBusiness';
import CampusManager from '../pages/campus/Campus';
import ListConfirmStudent from '../pages/confirmStudentList/ListConfirmStudent';
import EmployeeManager from '../pages/employee-manager/Employee-Manager';
import Formtimepicker from '../pages/form-timepicker/formtimepicker';
import Formrp from '../pages/form/Form';
import ReviewCV from '../pages/import-excel/ReviewCV';
import Status from '../pages/import-excel/Status';
import InfoStudent from '../pages/InfoStudent/infoStudent';
import Login from '../pages/login/Login';
import Major from '../pages/major/major';
import Narrows from '../pages/major/narrows';
import Reviewform from '../pages/mywork/Reviewform';
import ReviewReport from '../pages/mywork/ReviewReport';
import Profile from '../pages/profile/Profile';
import ReportForm from '../pages/report/ReportForm';
import FormSemester from '../pages/semesters/semesters';
import SupportStudent from '../pages/supportStudent/SupportStudent';
import { getLocal } from '../ultis/storage';
import Privateadmin from './private/privateAdmin';
import Privateroute from './private/privateRoute';
import PrivateStudent from './private/privateStudent';
import PrivateSupperAdmin from './private/privateSupperAdmin';
// import Company from "../pages/company/company";
const Router = () => {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />

			<Route
				path="/"
				element={
					<Privateroute>
						<LayoutWebsite />
					</Privateroute>
				}
			>
				<Route
					index
					element={
						<Navigate
							to={
								getLocal().isAdmin
									? getLocal()?.manager?.role === 1
										? '/status'
										: '/employee-manager'
									: '/info-Student'
							}
						/>
					}
				/>
				<Route path="profile" element={<Profile />} />
				<Route
					path="/support-student"
					element={
						<PrivateStudent>
							<SupportStudent />
						</PrivateStudent>
					}
				/>
				<Route
					path="info-student"
					element={
						<PrivateStudent>
							<InfoStudent />
						</PrivateStudent>
					}
				/>
				<Route
					path="report-form"
					element={
						<PrivateStudent>
							<ReportForm />
						</PrivateStudent>
					}
				/>
				<Route
					path="semesters"
					element={
						<Privateroute>
							<FormSemester />
						</Privateroute>
					}
				/>
				<Route
					path="/status"
					element={
						<Privateadmin>
							<Status />
						</Privateadmin>
					}
				/>
				<Route
					path="narrows"
					element={
						<PrivateSupperAdmin>
							<Narrows />
						</PrivateSupperAdmin>
					}
				/>
				<Route
					path="major"
					element={
						<PrivateSupperAdmin>
							<Major />
						</PrivateSupperAdmin>
					}
				/>
				<Route
					path="report"
					element={
						<PrivateStudent>
							<Formrp />
						</PrivateStudent>
					}
				/>
				<Route
					path="/employee-manager"
					element={
						<PrivateSupperAdmin>
							<EmployeeManager />
						</PrivateSupperAdmin>
					}
				/>
				<Route
					path="/campus-manager"
					element={
						<PrivateSupperAdmin>
							<CampusManager />
						</PrivateSupperAdmin>
					}
				/>
				<Route
					path="form-register"
					element={
						<Privateadmin>
							<Formtimepicker />
						</Privateadmin>
					}
				/>
				<Route
					path="review-cv"
					element={
						<Privateadmin>
							<ReviewCV />
						</Privateadmin>
					}
				/>
				<Route
					path="review-form"
					element={
						<Privateadmin>
							<Reviewform />
						</Privateadmin>
					}
				/>
				<Route
					path="review-report"
					element={
						<Privateadmin>
							<ReviewReport />
						</Privateadmin>
					}
				/>
				<Route
					path="up-file"
					element={
						<Privateadmin>
							<UpFile />
						</Privateadmin>
					}
				/>
				<Route
					path="company"
					element={
						<Privateadmin>
							<ListOfBusiness />
						</Privateadmin>
					}
				/>
				<Route
					path="wait-company"
					element={
						<Privateadmin>
							<WaitBusiness />
						</Privateadmin>
					}
				/>
				<Route
					path="request-from-student"
					element={
						<Privateadmin>
							<ListConfirmStudent />
						</Privateadmin>
					}
				/>
			</Route>
			<Route path="/404" element={<Notfound />} />
		</Routes>
	);
};
export default Router;
