import { combineReducers } from "redux";
import cumpusSlice from "../features/cumpusSlice/cumpusSlice";
import authSlice from "../features/authSlice/authSlice";
import studentSlice from "../features/StudentSlice/StudentSlice";
import userSlice from "../features/UserSlice/UserSilce";
import specializationSlice from "../features/specializationSlice/specializationSlice";
import managerSlice from "../features/managerSlice/managerSlice";
import dataSlice from "../features/DataSlice/DataSlice";
const rootReducer = combineReducers(
    {
    students:studentSlice,
    data:dataSlice,
    users:userSlice,
    auth: authSlice,
    cumpus:cumpusSlice,
    specialization:specializationSlice,
    manager: managerSlice
});
export default rootReducer;