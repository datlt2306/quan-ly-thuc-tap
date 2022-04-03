import { combineReducers } from "redux";
import dataSlice from "../features/DataSlice/DataSlice";
import authSlice from "../features/slice/authSlice";
import studentSlice from "../features/StudentSlice/StudentSlice";
import userSlice from "../features/UserSlice/UserSilce";
const rootReducer = combineReducers(
    {
    students:studentSlice,
    users:userSlice,
    data:dataSlice,
    auth: authSlice
});
export default rootReducer;