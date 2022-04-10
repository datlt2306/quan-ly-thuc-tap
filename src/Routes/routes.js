import React from "react";
import { Route, Routes } from "react-router-dom";
import LayoutWebsite from "../layouts/layoutWebsite";
import Login from "../pages/login/Login";
import SupportStudent from "../pages/supportStudent/SupportStudent";
import ProactiveStudent from "../pages/proactiveStudent/ProactiveStudent";
import Privateroute from "./private/privateRoute";
import Status from "../pages/import-excel/Status";
import ReviewCV from "../pages/import-excel/ReviewCV";
import UpFile from "../pages/import-excel/UpFile";
import EmployeeManager from "../pages/employee-manager/Employee-Manager";
import InfoStudent from "../pages/InfoStudent/infoStudent";
import Privateadmin from "./private/privateAdmin";
import Notfound from "../pages/404/404";
import ReportForm from "../pages/reportForm/ReportForm";
import Formrp from "../pages/form/Form";
import Reviewform from "../pages/mywork/Reviewform";
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
        <Route path="/support-student" element={<SupportStudent />} />
        <Route path="/proactive-student" element={<ProactiveStudent />} />

        <Route path="info-student" element={<InfoStudent />} />
        <Route path="report-form" element={<ReportForm />} />
        <Route path="report" element={<Formrp />} />

        <Route
          path="/employee-manager"
          element={
            <Privateadmin>
              <EmployeeManager />
            </Privateadmin>
          }
        />
        <Route
          path="status"
          element={
            <Privateadmin>
              <Status />
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
          path="up-file"
          element={
            <Privateadmin>
              <UpFile />
            </Privateadmin>
          }
        />
        <Route path="/404" element={<Notfound />} />
      </Route>
    </Routes>
  );
};
export default Router;
