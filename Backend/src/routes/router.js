import express from "express";
import {
  createNewAssignment,
  deleteAssignment,
  getAssignmentSubmissions,
  getTeacherAssignments,
  gradeSubmission,
  updatingAssignment,
} from "../controllers/assignmentController.js";
import {
  signupController,
  loginController,
  otpProcessApi,
  otpVerify,
  verifyController,
} from "../controllers/authController.js";
import {
  createTeacherAndAssignStudents,
  deleteTeacherById,
  getAllTeachers,
} from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import teacherMiddleware from "../middleware/teacherMiddleware.js";

import studentMiddleware from "../middleware/studentMiddleware.js";

import {
  editAssignmentSubmission,
  getStudentAssignments,
  submitAssignment,
  uploadFile,
} from "../controllers/studentSubmitController.js";

const router = express.Router();

// Routes
router.get("/", (request, response) => {
  response.status(200).json({
    message: "Welcome to Assignment Submission Portal",
  });
});
// Teacher ka kam
router.post("/assignments", teacherMiddleware, createNewAssignment);
router.get("/assignments", teacherMiddleware, getTeacherAssignments);
router.put("/assignments/:id", teacherMiddleware, updatingAssignment); //  ya bc na time khaya 1 din Update
router.delete("/assignments/:id", teacherMiddleware, deleteAssignment); //delete

router.get(
  "/assignments/:id/submissions",
  teacherMiddleware,
  getAssignmentSubmissions
); // Grade a student's submission for a specific assignment (PUT)   /assignments/:id/grade
router.put("/submissions/:id/grade", teacherMiddleware, gradeSubmission);

// student new route     /                 teacherMiddleware                                         // bc ya student portal na mera 3 sa char din lia ha lakin is na phir bhi apni m* be* ker

router.get("/students/assignments", studentMiddleware, getStudentAssignments); // Edit a student's assignment submission (PUT)
router.put(
  "/students/assignments/:id/edit",
  studentMiddleware,
  uploadFile,
  submitAssignment
  // editAssignmentSubmission
);
router.post(
  "/students/assignments/:id/submit",
  studentMiddleware,
  uploadFile,
  submitAssignment
);

// sign up handle kia ha is ma bc ya hi itna _____
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/otp-process", otpProcessApi);
router.post("/verify-otp", otpVerify);
router.get("/verify", verifyController);
router.post(
  "/register-teacher",
  authMiddleware,
  createTeacherAndAssignStudents
);
router.get("/teachers", authMiddleware, getAllTeachers);
router.delete("/teachers/:id", authMiddleware, deleteTeacherById);
export default router;
