import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../containers/website/login/Login";
import Status from "../components/website/import-excel/Status";
import ReviewCV from "../components/website/import-excel/ReviewCV";
import UpFile from "../components/website/import-excel/UpFile";
import SupportStudent from "../containers/website/supportStudent/SupportStudent";
import ProactiveStudent from "../containers/website/proactiveStudent/ProactiveStudent";
import Privateroute from "./private/privateRoute";
import ReviewReport from "../components/website/import-excel/ReviewReport";
import LayoutAdmin from "../layouts/LayoutAdmin";
import LayoutWebsite from "../layouts/LayoutWebsite";

const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Privateroute><LayoutWebsite /></Privateroute>}>
        <Route path="/support-student" element={<SupportStudent />} />
        <Route path="/proactive-student" element={<ProactiveStudent />} />
      </Route>

      <Route path="quan-ly/" element={<LayoutAdmin />}>
        <Route path="sinh-vien/danh-sach-dang-ky" element={<Status />} />
        <Route path="xem-cv" element={<ReviewCV />} />
        <Route path="xem-bao-cao" element={<ReviewReport />} />
        <Route path="up-file" element={<UpFile />} />
      </Route>
    </Routes>
  );
};
export default Router;
