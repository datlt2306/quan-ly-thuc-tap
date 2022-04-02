import { combineReducers } from "redux";
import studentSlice from "../features/StudentSlice/StudentSlice";
import userSlice from "../features/UserSlice/UserSilce";
const rootReducer = combineReducers(
    {
    students:studentSlice,
    users:userSlice

});
export default rootReducer;