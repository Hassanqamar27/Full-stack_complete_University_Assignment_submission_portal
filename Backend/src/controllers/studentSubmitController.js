import Assignment from "../models/assignmentschema.js";
import User from "../models/usersSchema.js";
import cloudinary from "../config/cloudinary.js";
import upload from "../middleware/multer-config.js"; // Import Multer configuration

// Middleware for handling file upload
export const uploadFile = upload.single("file"); // 'file' is the field name in the form

export const getStudentAssignments = async (req, res) => {
  try {
    const studentId = req.user.id; // Assuming studentId is coming from token (authenticated user)
    // console.log(studentId);
    // Ensure user is a student
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res
        .status(403)
        .json({ message: "Access denied. You are not a student." });
    }
    const assignments = await Assignment.find({
      // teacher: student.assignedStudents,
      teacher: { $in: student.assignedStudents },
    })
      .populate("teacher", "name email")
      .populate("submissions.student", "name") // Populate student details
      .select("title description dueDate submissions"); // Only select necessary fields
    // console.log(assignments);
    // Check if student has submitted each assignment
    const assignmentWithSubmissionStatus = assignments.map((assignment) => {
      const submission = assignment.submissions.find((sub) =>
        sub.student._id.equals(studentId)
      );
      return {
        ...assignment.toObject(),
        isSubmitted: !!submission, // Boolean to indicate submission status
        submissionDetails: submission ? submission : null, // Return submission details if available
        grade: submission ? submission.grade : null, // Include grade if submission exists
      };
    });

    res.status(200).json({ assignments: assignmentWithSubmissionStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editAssignmentSubmission = async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.params:", req.params);
  console.log("req.file:", req.file); // Make sure req.file has the expected data

  try {
    const studentId = req.user.id; // Assuming studentId is coming from token (authenticated user)
    const assignmentId = req.params.id;

    console.log("Student ID:", studentId);
    console.log("Assignment ID:", assignmentId);

    // Ensure user is a student
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      console.log("Access Denied: Not a student");
      return res
        .status(403)
        .json({ message: "Access denied. You are not a student." });
    }

    // Find and update the assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      console.log("Assignment Not Found");
      return res.status(404).json({ message: "Assignment not found." });
    }

    // Check if the due date has passed
    if (assignment.dueDate < Date.now()) {
      console.log("Assignment Due Date Passed");
      return res.status(400).json({
        message: "You cannot edit this submission. The due date has passed.",
      });
    }

    // Check if the student has already submitted the assignment
    const submissionIndex = assignment.submissions.findIndex((sub) =>
      sub.student.equals(studentId)
    );
    if (submissionIndex === -1) {
      console.log("Submission Not Found");
      return res
        .status(400)
        .json({ message: "You have not submitted this assignment yet." });
    }

    // Prepare update object
    const updateFields = {};

    // Handle file upload and update
    if (req.file) {
      const existingFileUrl = assignment.submissions[submissionIndex].fileUrl;
      if (existingFileUrl) {
        const publicId = existingFileUrl.split("/").slice(-1)[0].split(".")[0]; // Extract the public ID from URL
        console.log("Public ID to delete:", publicId);
        const deleteResult = await cloudinary.uploader.destroy(publicId);
        console.log("Delete Result:", deleteResult); // Log delete result
        if (deleteResult.result !== "ok") {
          console.log("Failed to delete existing file");
        } else {
          console.log("Deleted existing file from Cloudinary");
        }
      }

      // Upload the new file to Cloudinary
      const result = req.file.path;

      // Add new file URL to the updateFields object
      updateFields["submissions." + submissionIndex + ".fileUrl"] =
        result.secure_url;
      console.log("Uploaded new file to Cloudinary:", result.secure_url);
    }

    // Update the assignment with new submission details
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { $set: updateFields },
      { new: true } // Return the updated document
    );

    if (!updatedAssignment) {
      console.log("Update Failed");
      return res
        .status(404)
        .json({ message: "Assignment not found or failed to update." });
    }

    res.status(200).json({
      message: "Assignment submission updated successfully",
      assignment: updatedAssignment,
    });
  } catch (error) {
    console.error("Error editing assignment submission:", error);
    res.status(500).json({ message: error.message });
  }
};

import { uploadFileToCloudinary } from "../utils/cloudinaryUtils.js";

export const submitAssignment = async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.params:", req.params);
  console.log("req.file:", req.file);

  try {
    const studentId = req.user?.id; // Use optional chaining to prevent undefined error
    const assignmentId = req.params?.id;

    console.log("Student ID:", studentId);
    console.log("Assignment ID:", assignmentId);

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      console.log("Student not found or role is not student");
      return res
        .status(403)
        .json({ message: "Access denied. You are not a student." });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      console.log("Assignment not found");
      return res.status(404).json({ message: "Assignment not found." });
    }

    if (!student.assignedStudents.includes(assignment.teacher.toString())) {
      console.log("Not allowed to submit this assignment");
      return res
        .status(403)
        .json({ message: "You are not allowed to submit this assignment." });
    }

    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ message: "No file uploaded." });
    }
    // Upload the new file to Cloudinary
    const fileUrl = req.file.path;
    const isLate = Date.now() > assignment.dueDate;
    console.log(fileUrl, isLate);

    let updatedAssignment = await Assignment.findOneAndUpdate(
      {
        _id: assignmentId, // Find the assignment by ID
        "submissions.student": studentId, // Check if this student has already submitted
      },
      {
        // If student exists, update their submission
        $set: {
          "submissions.$.fileUrl": fileUrl, // Update the file URL
          "submissions.$.isLate": isLate, // Update the late status
          "submissions.$.submittedAt": Date.now(), // Update the submission time
        },
      },
      {
        new: true, // Return the updated document
        upsert: false, // Don't insert a new record if student hasn't submitted
      }
    );

    console.log(updatedAssignment);
    // If the student hasn't submitted before, push a new submission
    if (!updatedAssignment) {
      const newSubmission = {
        student: studentId,
        fileUrl: fileUrl,
        isLate: isLate,
        submittedAt: Date.now(),
      };

      updatedAssignment = await Assignment.findByIdAndUpdate(
        assignmentId,
        { $push: { submissions: newSubmission } }, // Push new submission to the array
        { new: true }
      );
      return res.status(200).json({
        message: "Assignment submitted successfully",
        submission: updatedAssignment.submissions,
      });
    }

    return res.status(200).json({
      message: "Assignment submission updated successfully",
      assignment: updatedAssignment,
    });
  } catch (error) {
    console.error("Error submitting assignment:", error);
    res.status(500).json({ message: error.message });
  }
};
/**
 * Handles assignment submission.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
