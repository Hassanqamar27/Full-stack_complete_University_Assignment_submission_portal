import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import teacherReducer from "./slices/teacherSlice.js";
import assignmentReducer from "./slices/assignmentSlice.js";
import studentReducer from "./slices/studentSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    teachers: teacherReducer,
    assignments: assignmentReducer,
    student: studentReducer,
  },
});

export default store;
