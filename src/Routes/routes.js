import React from "react";
import { Route, Routes } from "react-router-dom";
import LayoutWebsite from "../layouts/layoutWebsite";
import Login from "../pages/login/Login";
import SupportStudent from "../pages/supportStudent/SupportStudent";
import Privateroute from "./private/privateRoute";
import Status from "../pages/import-excel/Status";
import ReviewCV from "../pages/import-excel/ReviewCV";
import UpFile from "../components/ExcelDocument/UpFile";
import EmployeeManager from "../pages/employee-manager/Employee-Manager";
import InfoStudent from "../pages/InfoStudent/infoStudent";
import Privateadmin from "./private/privateAdmin";
import Notfound from "../pages/404/404";
import ReportForm from "../pages/report/ReportForm";
import Formrp from "../pages/form/Form";
import Reviewform from "../pages/mywork/Reviewform";
import Formtimepicker from "../pages/form-timepicker/formtimepicker";
import ReviewReport from "../pages/mywork/ReviewReport";
import ListOfBusiness from "../pages/business/ListOfBusiness";
import FormSemester from "../pages/semesters/semesters";
import Major from "../pages/major/major";
import Narrow from "../pages/narrow/narrow";
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
            <Privateroute>
              <SupportStudent />
            </Privateroute>
          }
        />
        <Route
          path="info-student"
          element={
            <Privateroute>
              <InfoStudent />
            </Privateroute>
          }
        />
        <Route
          path="report-form"
          element={
            <Privateroute>
              <ReportForm />
            </Privateroute>
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
          path="major"
          element={
            <Privateroute>
              <Major />
            </Privateroute>
          }
        />
        <Route
          path="report"
          element={
            <Privateroute>
              <Formrp />
            </Privateroute>
          }
        />

        <Route
          path="/employee-manager"
          element={
            <Privateroute>
              <Privateadmin>
                <EmployeeManager />
              </Privateadmin>
            </Privateroute>
          }
        />
        <Route
          path="status"
          element={
            <Privateroute>
              <Privateadmin>
                <Status />
              </Privateadmin>
            </Privateroute>
          }
        />
        {/* <Route
          path="company"
          element={
            <Privateroute>
              <Privateadmin>
                <Company />
              </Privateadmin>
            </Privateroute>
          }
        /> */}
        <Route
          path="narrow"
          element={
            <Privateroute>
              <Privateadmin>
                <Narrow />
              </Privateadmin>
            </Privateroute>
          }
        />
        <Route
          path="form-register"
          element={
            <Privateroute>
              <Privateadmin>
                <Formtimepicker />
              </Privateadmin>
            </Privateroute>
          }
        />
        <Route
          path="review-cv"
          element={
            <Privateroute>
              <Privateadmin>
                <ReviewCV />
              </Privateadmin>
            </Privateroute>
          }
        />
        <Route
          path="review-form"
          element={
            <Privateroute>
              <Privateadmin>
                <Reviewform />
              </Privateadmin>
            </Privateroute>
          }
        />
        <Route
          path="review-report"
          element={
            <Privateroute>
              <Privateadmin>
                <ReviewReport />
              </Privateadmin>
            </Privateroute>
          }
        />
        <Route
          path="up-file"
          element={
            <Privateroute>
              <Privateadmin>
                <UpFile />
              </Privateadmin>
            </Privateroute>
          }
        />
        <Route
          path="company"
          element={
            <Privateroute>
              <Privateadmin>
                <ListOfBusiness />
              </Privateadmin>
            </Privateroute>
          }
        />

        <Route path="/404" element={<Notfound />} />
      </Route>
    </Routes>
  );
};
export default Router;
