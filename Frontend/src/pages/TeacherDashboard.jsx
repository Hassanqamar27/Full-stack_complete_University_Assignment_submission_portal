import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  fetchSubmissions,
  updateSubmissionGrade,
} from "../redux/slices/assignmentSlice";
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Typography,
  Container,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Box,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Slide,
  Collapse,
  styled,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  FileDownload,
  Visibility,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VisibilityOff, AssignmentTurnedIn } from "@mui/icons-material";
// Styled components for enhanced styling
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[4],
  borderRadius: "12px",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: theme.shadows[8],
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  transition: "color 0.3s, transform 0.3s",
  "&:hover": {
    color: theme.palette.primary.main,
    transform: "scale(1.2)",
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    padding: theme.spacing(2),
  },
}));

const TeacherDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { assignments, submissions, loading, error } = useSelector(
    (state) => state.assignments
  );
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [expandedAssignment, setExpandedAssignment] = useState(null); // Track expanded assignment for toggle

  // Fetch assignments on component mount
  useEffect(() => {
    dispatch(fetchAssignments()).catch(() =>
      toast.error("Error fetching assignments")
    );
  }, [dispatch]);

  const handleDialogOpen = (assignment = null) => {
    setOpen(true);
    if (assignment) {
      setEditMode(true);
      setCurrentId(assignment._id);
      setFormState({
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
      });
    } else {
      setEditMode(false);
      setFormState({ title: "", description: "", dueDate: "" });
    }
  };

  const handleDialogClose = () => setOpen(false);

  const handleDeleteDialogOpen = (assignmentId) => {
    setCurrentId(assignmentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => setDeleteDialogOpen(false);

  const handleSave = () => {
    const action = editMode
      ? updateAssignment({ assignmentId: currentId, updatedData: formState })
      : createAssignment(formState);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(
          editMode ? "Assignment updated successfully!" : "Assignment created!"
        );
        handleDialogClose();
      })
      .catch(() => {
        toast.error(
          editMode ? "Error updating assignment" : "Error creating assignment"
        );
      });
  };

  const handleDelete = () => {
    dispatch(deleteAssignment(currentId))
      .then(() => {
        toast.success("Assignment deleted successfully!");
        handleDeleteDialogClose();
      })
      .catch(() => toast.error("Error deleting assignment"));
  };

  const handleToggleSubmissions = (assignmentId) => {
    if (expandedAssignment === assignmentId) {
      setExpandedAssignment(null); // Close if it's already expanded
    } else {
      setExpandedAssignment(assignmentId); // Expand new assignment
      dispatch(fetchSubmissions(assignmentId)).catch(() =>
        toast.error("Error fetching submissions")
      );
    }
  };

  const handleGradeChange = (submissionId, grade) => {
    dispatch(updateSubmissionGrade({ submissionId, grade }))
      .then(() => toast.success("Grade submitted successfully!"))
      .catch(() => toast.error("Failed to submit grade."));
  };

  const renderFilePreview = (url) => {
    const fileType = url.split(".").pop();

    switch (fileType) {
      case "pdf":
        return (
          <iframe
            src={url}
            style={{
              width: "100%",
              height: "400px",
              border: "none",
              borderRadius: "4px",
              boxShadow: theme.shadows[2],
            }}
            title="PDF Preview"
          />
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return (
          <img
            src={url}
            alt="File Preview"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "4px",
              boxShadow: theme.shadows[2],
            }}
          />
        );
      case "zip":
      case "doc":
      case "docx":
        return (
          <Typography>
            <a href={url} download>
              Download {fileType} file
            </a>
          </Typography>
        );
      default:
        return (
          <Typography>
            <a href={url} download>
              Download {fileType} file
            </a>
          </Typography>
        );
    }
  };

  return (
    <Container style={{ marginTop: "20px" }}>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Teacher Dashboard
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => handleDialogOpen()}
        style={{ marginBottom: "20px", borderRadius: "12px" }}
      >
        Create Assignment
      </Button>

      <Grid container spacing={3}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="60vh"
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : (
          assignments.map((assignment) => (
            <Grid item xs={12} md={4} key={assignment._id}>
              <Slide direction="up" in={true} timeout={500}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      {assignment.title}
                    </Typography>
                    <Typography variant="body2">
                      {assignment.description}
                    </Typography>
                    <Typography color="textSecondary" style={{ marginTop: 10 }}>
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <StyledIconButton
                      color="primary"
                      onClick={() => handleDialogOpen(assignment)}
                    >
                      <Edit />
                      Edit
                    </StyledIconButton>
                    <StyledIconButton
                      color="secondary"
                      onClick={() => handleDeleteDialogOpen(assignment._id)}
                    >
                      <Delete />
                      Del
                    </StyledIconButton>
                    <StyledIconButton
                      color="default"
                      onClick={() => handleToggleSubmissions(assignment._id)}
                    >
                      {expandedAssignment === assignment._id ? (
                        <VisibilityOff />
                      ) : (
                        <AssignmentTurnedIn />
                      )}
                      Sub
                    </StyledIconButton>
                  </CardActions>
                  <Collapse in={expandedAssignment === assignment._id}>
                    {submissions[assignment._id]?.length > 0 ? (
                      submissions[assignment._id]?.map((submission) => (
                        <Card key={submission._id} style={{ margin: "16px 0" }}>
                          <CardContent>
                            <Typography>
                              {submission.student.name} -{" "}
                              {submission.student.email}
                            </Typography>
                            {renderFilePreview(submission.fileUrl)}
                            <Typography>
                              Submitted At:{" "}
                              {new Date(
                                submission.submittedAt
                              ).toLocaleString()}
                            </Typography>
                            <Box display="flex" alignItems="center">
                              Edit Grade :
                              <Select
                                value={submission.grade || ""}
                                onChange={(e) =>
                                  handleGradeChange(
                                    submission._id,
                                    e.target.value
                                  )
                                }
                                style={{ marginRight: "8px" }}
                              >
                                <MenuItem value="">Select Grade</MenuItem>
                                <MenuItem value="A">A</MenuItem>
                                <MenuItem value="B">B</MenuItem>
                                <MenuItem value="C">C</MenuItem>
                                <MenuItem value="D">D</MenuItem>
                              </Select>
                              <StyledIconButton color="primary">
                                <Visibility />
                              </StyledIconButton>
                              <StyledIconButton
                                color="default"
                                href={submission.fileUrl}
                                download
                              >
                                <FileDownload />
                              </StyledIconButton>
                            </Box>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Typography
                        color="textSecondary"
                        align="center"
                        style={{ marginTop: 10 }}
                      >
                        No submissions available
                      </Typography>
                    )}
                  </Collapse>
                </StyledCard>
              </Slide>
            </Grid>
          ))
        )}
      </Grid>

      {/* Dialog for creating/updating assignments */}
      <StyledDialog open={open} onClose={handleDialogClose}>
        <DialogTitle>
          {editMode ? "Edit Assignment" : "Create Assignment"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            value={formState.title}
            onChange={(e) =>
              setFormState({ ...formState, title: e.target.value })
            }
            style={{ marginBottom: "16px" }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formState.description}
            onChange={(e) =>
              setFormState({ ...formState, description: e.target.value })
            }
            style={{ marginBottom: "16px" }}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formState.dueDate}
            onChange={(e) =>
              setFormState({ ...formState, dueDate: e.target.value })
            }
            style={{ marginBottom: "16px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </StyledDialog>

      {/* Delete Confirmation Dialog */}
      <StyledDialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this assignment? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </StyledDialog>
    </Container>
  );
};

export default TeacherDashboard;
