import Assignment from "../models/assignmentschema.js";
import User from "../models/usersSchema.js";

// Create Assignment
export const createNewAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const teacherId = req.user.id; // Assuming teacherId is coming from token (authenticated user)

    // Ensure teacher is creating the assignment
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Access denied. You are not a teacher." });
    }

    // Create new assignment
    const newAssignment = new Assignment({
      title,
      description,
      dueDate,
      teacher: teacherId,
      submissions: [],
    });

    // Save assignment to DB
    await newAssignment.save();

    res.status(201).json({
      message: "Assignment created successfully",
      assignment: newAssignment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get Assignments for a specific teacher
export const getTeacherAssignments = async (req, res) => {
  try {
    const teacherId = req.user.id; // Assuming teacherId is coming from token (authenticated user)

    // Ensure user is a teacher
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Access denied. You are not a teacher." });
    }

    // Find assignments by teacher ID
    const assignments = await Assignment.find({ teacher: teacherId }).populate(
      "submissions.student",
      "name email"
    );

    res.status(200).json({ assignments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update a specific assignment
export const updatingAssignment = async (req, res) => {
  try {
    const teacherId = req.user.id; // Assuming teacherId is coming from token (authenticated user)
    const { title, description, dueDate } = req.body;
    const assignmentId = req.params.id;

    // Ensure user is a teacher
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Access denied. You are not a teacher." });
    }

    // Find the assignment and check if it belongs to the teacher
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      teacher: teacherId,
    });
    if (!assignment) {
      return res
        .status(404)
        .json({ message: "Assignment not found or not authorized." });
    }

    // Update assignment fields
    if (title) assignment.title = title;
    if (description) assignment.description = description;
    if (dueDate) {
      if (new Date(dueDate) <= new Date()) {
        return res
          .status(400)
          .json({ message: "Due date must be in the future." });
      }
      assignment.dueDate = dueDate;
    }

    // Save updated assignment to the database
    await assignment.save();

    res
      .status(200)
      .json({ message: "Assignment updated successfully", assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Delete an assignment
export const deleteAssignment = async (req, res) => {
  try {
    const teacherId = req.user.id; // Assuming teacherId is coming from token (authenticated user)
    const assignmentId = req.params.id;
    // sala bc na apni g marwadi is kam na bhadwa na din kha lia pora
    // console.log("Teacher ID from token:", teacherId);
    // console.log("Assignment ID from request:", assignmentId);

    // Ensure user is a teacher
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Access denied. You are not a teacher." });
    }

    // Find the assignment and check if it belongs to the teacher
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      teacher: teacherId,
    });
    if (!assignment) {
      return res
        .status(404)
        .json({ message: "Assignment not found or not authorized." });
    }

    // Delete the assignment
    await Assignment.deleteOne({ _id: assignmentId });

    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all submissions for a specific assignment (teacher only)
export const getAssignmentSubmissions = async (req, res) => {
  try {
    const teacherId = req.user.id; // Assuming teacherId is coming from token
    const assignmentId = req.params.id;

    // Find the assignment and ensure it's assigned to the authenticated teacher
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      teacher: teacherId,
    }).populate("submissions.student", "name email");
    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found or you are not authorized to view this.",
      });
    }

    // Return the submissions for the assignment
    res.status(200).json({ submissions: assignment.submissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const gradeSubmission = async (req, res) => {
  const teacherId = req.user.id;
  const submissionId = req.params.id;
  const { grade } = req.body;
  console.log(grade, submissionId);

  try {
    const submission = await Assignment.findOneAndUpdate(
      {
        // _id: assignmentId,
        "submissions._id": submissionId,
      },
      {
        $set: { "submissions.$.grade": grade },
      },
      { new: true } // Option to return the modified document
    );
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.json({ message: "Grade assigned successfully", submission });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
