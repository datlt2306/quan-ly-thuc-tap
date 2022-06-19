import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LayoutWebsite from '../layouts/layoutWebsite';
import Login from '../pages/login/Login';
import SupportStudent from '../pages/supportStudent/SupportStudent';
import Privateroute from './private/privateRoute';
import Status from '../pages/import-excel/Status';
import ReviewCV from '../pages/import-excel/ReviewCV';
import UpFile from '../components/ExcelDocument/UpFile';
import EmployeeManager from '../pages/employee-manager/Employee-Manager';
import InfoStudent from '../pages/InfoStudent/infoStudent';
import Privateadmin from './private/privateAdmin';
import Notfound from '../pages/404/404';
import ReportForm from '../pages/report/ReportForm';
import Formrp from '../pages/form/Form';
import Reviewform from '../pages/mywork/Reviewform';
import Formtimepicker from '../pages/form-timepicker/formtimepicker';
import ReviewReport from '../pages/mywork/ReviewReport';
import ListOfBusiness from '../pages/business/ListOfBusiness';
import FormSemester from '../pages/semesters/semesters';
import Major from '../pages/major/major';
import PrivateStudent from './private/privateStudent';
import CampusManager from '../pages/campus/Campus';
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
          index
          element={
              <Privateadmin>
                <Status />
              </Privateadmin>
          }
        />
        <Route
          path="major"
          element={
            <Privateadmin>

              <Major />
              </Privateadmin>

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
              <Privateadmin>
                <EmployeeManager />
              </Privateadmin>
          }
        />
        <Route
          path="/campus-manager"
          element={
              <Privateadmin>
                <CampusManager />
              </Privateadmin>
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
      </Route>
      <Route path="/404" element={<Notfound />} />

    </Routes>
  );
};
export default Router;
