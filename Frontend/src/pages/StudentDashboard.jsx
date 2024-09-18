import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentAssignments,
  submitAssignment,
  editAssignmentSubmission,
} from "../redux/slices/studentSlice";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Divider,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Fade,
  Tooltip,
} from "@mui/material";
import { toast } from "react-toastify";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EditIcon from "@mui/icons-material/Edit";
import SubmitIcon from "@mui/icons-material/Send";
import EmptyIllustration from "../../public/5.png"; // Add an empty state illustration for better UX

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { assignments, loading, error } = useSelector((state) => state.student);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [file, setFile] = useState(null); // Use file object

  useEffect(() => {
    dispatch(fetchStudentAssignments())
      .unwrap()
      .catch((err) => console.error("Error fetching assignments:", err));
  }, [dispatch]);

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Submit or Edit assignment
  const handleAssignmentAction = async (assignmentId, isEdit) => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        if (isEdit) {
          await dispatch(
            editAssignmentSubmission({ assignmentId, formData })
          ).unwrap();
          toast.success("Assignment edited successfully!");
        } else {
          await dispatch(submitAssignment({ assignmentId, formData })).unwrap();
          toast.success("Assignment submitted!");
        }
        setSelectedAssignment(null);
        dispatch(fetchStudentAssignments()); // Refresh assignments
      } catch (err) {
        toast.error(`Error: ${err.message}`);
      }
    } else {
      toast.error("Please upload a file before submitting!");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Student Dashboard
      </Typography>
      <Divider sx={{ mb: 4 }} />

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {assignments.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              width="100%"
              mt={4}
            >
              <img
                src={EmptyIllustration}
                alt="No Assignments"
                style={{ maxWidth: "300px", marginBottom: "20px" }}
              />
              <Typography variant="h6" color="textSecondary">
                No assignments available.
              </Typography>
            </Box>
          ) : (
            assignments.map((assignment) => (
              <Grid item xs={12} sm={6} md={4} key={assignment._id}>
                <Card
                  sx={{
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-10px)",
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h6">{assignment.title}</Typography>
                      <Tooltip
                        title={
                          assignment.isSubmitted ? "Edit Submission" : "Submit"
                        }
                      >
                        <IconButton
                          onClick={() => setSelectedAssignment(assignment)}
                          sx={{
                            "&:hover": {
                              backgroundColor: assignment.isSubmitted
                                ? "#ffea00"
                                : "#00e676",
                            },
                          }}
                        >
                          {assignment.isSubmitted ? (
                            <EditIcon />
                          ) : (
                            <SubmitIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="body2">
                      Due Date:{" "}
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      Status: {assignment.isSubmitted ? "Submitted" : "Pending"}
                    </Typography>
                    {assignment.isSubmitted && (
                      <Typography variant="body2">
                        Grade: {assignment.grade || "Not graded yet"}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {selectedAssignment && (
        <Fade in={!!selectedAssignment}>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              {selectedAssignment.isSubmitted
                ? "Edit Your Submission"
                : "Submit Your Assignment"}
            </Typography>
            <TextField
              type="file"
              fullWidth
              onChange={handleFileChange}
              inputProps={{ accept: ".pdf,.doc,.docx,.zip" }}
              sx={{ my: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={
                selectedAssignment.isSubmitted ? <EditIcon /> : <SubmitIcon />
              }
              onClick={() =>
                handleAssignmentAction(
                  selectedAssignment._id,
                  selectedAssignment.isSubmitted
                )
              }
              sx={{
                backgroundColor: selectedAssignment.isSubmitted
                  ? "#ffea00"
                  : "#00e676",
                "&:hover": {
                  backgroundColor: selectedAssignment.isSubmitted
                    ? "#ffd600"
                    : "#00c853",
                },
              }}
            >
              {selectedAssignment.isSubmitted ? "Edit Submission" : "Submit"}
            </Button>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default StudentDashboard;
