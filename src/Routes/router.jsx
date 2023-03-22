import { Fragment } from 'react';
import { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { path } from '../config/path';
import LayoutWebsite from '../layouts/layoutWebsite';
import { roles } from '../ultis';
import { getLocal } from '../ultis/storage';
import Privateadmin from './private/privateAdmin';
import PrivateRoute from './private/privateRoute';
import PrivateStudent from './private/privateStudent';
import PrivateSupperAdmin from './private/privateSupperAdmin';

export const renderRoutes = (routes) => (
	<>
		{routes.map((route, i) => {
			const Guard = route.guard || Fragment;
			const Layout = route.layout || Fragment;
			const Page = route.page;
			return (
				<Route
					key={route.path}
					path={route.path}
					element={
						<Guard>
							<Layout>
								<Page />
							</Layout>
						</Guard>
					}
				>
					{route.routes ? renderRoutes(route.routes) : <></>}
				</Route>
			);
		})}
	</>
);

export const routerData = [
	{
		path: path.LOGIN,
		page: lazy(() => import('../pages/login/Login')),
	},
	{
		path: path.NOT_FOUND,
		page: lazy(() => import('../pages/404/404')),
	},
	{
		path: path.HOME,
		guard: PrivateRoute,
		layout: LayoutWebsite,
		page: PageLayout,
		routes: [
			{
				path: path.PROFILE,
				page: lazy(() => import('../pages/profile/Profile')),
			},
			{
				path: path.SUPPORT_SUTDENT,
				page: lazy(() => import('../pages/supportStudent/SupportStudent')),
				guard: PrivateStudent,
			},
			{
				path: path.INFO_STUDENT,
				page: lazy(() => import('../pages/InfoStudent/infoStudent')),
				guard: PrivateStudent,
			},
			{
				path: path.REPORT_FORM,
				page: lazy(() => import('../pages/report/ReportForm')),
				guard: PrivateStudent,
			},
			{
				path: path.SEMESTERS,
				page: lazy(() => import('../pages/semesters/semesters')),
				guard: PrivateRoute,
			},
			{
				path: path.STATUS,
				page: lazy(() => import('../pages/import-excel/Status')),
				guard: Privateadmin,
			},
			{
				path: path.NARROWS,
				page: lazy(() => import('../pages/major/narrows')),
				guard: PrivateSupperAdmin,
			},
			{
				path: path.MAJOR,
				page: lazy(() => import('../pages/major/major')),
				guard: PrivateSupperAdmin,
			},
			{
				path: path.REPORT,
				page: lazy(() => import('../pages/form/Form')),
				guard: PrivateStudent,
			},
			{
				path: path.EMPLOYEE_MANAGER,
				page: lazy(() => import('../pages/employee-manager/Employee-Manager')),
				guard: PrivateSupperAdmin,
			},
			{
				path: path.CAMPUS_MANAGER,
				page: lazy(() => import('../pages/campus/Campus')),
				guard: PrivateSupperAdmin,
			},
			{
				path: path.FORM_REGISTER,
				page: lazy(() => import('../pages/form-timepicker/formtimepicker')),
				guard: Privateadmin,
			},
			{
				path: path.REVIEW_CV,
				page: lazy(() => import('../pages/import-excel/ReviewCV')),
				guard: Privateadmin,
			},
			{
				path: path.REVIEW_FORM,
				page: lazy(() => import('../pages/mywork/Reviewform')),
				guard: Privateadmin,
			},
			{
				path: path.REVIEW_REPORT,
				page: lazy(() => import('../pages/mywork/ReviewReport')),
				guard: Privateadmin,
			},
			{
				path: path.UP_FILE,
				page: lazy(() => import('../components/ExcelDocument/UpFile')),
				guard: Privateadmin,
			},
			{
				path: path.COMPANY,
				page: lazy(() => import('../pages/business/ListOfBusiness')),
				guard: Privateadmin,
			},
			{
				path: path.WAIT_COMPANY,
				page: lazy(() => import('../pages/business/WaitBusiness')),
				guard: Privateadmin,
			},
			{
				path: path.REQUEST_FORM_STUDENT,
				page: lazy(() => import('../pages/confirmStudentList/ListConfirmStudent')),
				guard: Privateadmin,
			},
		],
	},
];

function PageLayout() {
	return (
		<Navigate
			to={
				getLocal().isAdmin
					? getLocal()?.manager?.role === roles.MANAGER
						? path.STATUS
						: path.EMPLOYEE_MANAGER
					: path.INFO_STUDENT
			}
		/>
	);
}
