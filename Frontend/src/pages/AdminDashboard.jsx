import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Collapse,
  TextField,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  List,
  ListItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  createTeacher,
  fetchTeachers,
  deleteTeacher,
  selectTeachers,
  selectLoading,
  selectError,
} from "../redux/slices/teacherSlice";

// Styled Card with hover effect
const ActionCard = styled(Card)(({ theme }) => ({
  padding: "20px",
  backgroundColor: theme.palette.background.paper,
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[20],
  },
}));

const AdminDashboard = () => {
  const [openSection, setOpenSection] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [course, setCourse] = useState("");
  const [timing, setTiming] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const dispatch = useDispatch();
  const teachers = useSelector(selectTeachers);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const handleToggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    dispatch(createTeacher({ name, email, password, course, timing }))
      .unwrap()
      .then((response) => {
        toast.success(response.message);
        setName("");
        setEmail("");
        setPassword("");
        setCourse("");
        setTiming("");
        if (response.teacher.assignedStudents.length > 0) {
          toast.info(
            `Assigned students: ${response.teacher.assignedStudents.join(", ")}`
          );
        } else {
          toast.info("No students assigned to this teacher yet.");
        }
      })
      .catch((err) => {
        toast.error(err.message || "Something went wrong");
      });
  };

  const handleViewTeachers = () => {
    handleToggleSection("viewTeachers");
    if (openSection !== "viewTeachers") {
      dispatch(fetchTeachers());
    }
  };

  const handleDeleteTeacher = () => {
    dispatch(deleteTeacher(selectedTeacher))
      .unwrap()
      .then((response) => {
        toast.success(response.message);
        setSelectedTeacher("");
        setConfirmOpen(false);
      })
      .catch((err) => {
        toast.error(err.message || "Something went wrong");
      });
  };

  return (
    <Container>
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Admin Dashboard
        </Typography>

        {/* Button Options */}
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <ActionCard>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Create Teacher
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  color="primary"
                  fullWidth
                  onClick={() => handleToggleSection("createTeacher")}
                >
                  Create Teacher
                </Button>
              </CardContent>
            </ActionCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <ActionCard>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  View Teachers
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<VisibilityIcon />}
                  color="secondary"
                  fullWidth
                  onClick={handleViewTeachers}
                >
                  See Teachers
                </Button>
              </CardContent>
            </ActionCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <ActionCard>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Delete Teacher
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  color="error"
                  fullWidth
                  onClick={() => handleToggleSection("deleteTeacher")}
                >
                  Delete Teacher
                </Button>
              </CardContent>
            </ActionCard>
          </Grid>
        </Grid>

        {/* Create Teacher Form */}
        <Collapse in={openSection === "createTeacher"}>
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Create Teacher
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <form onSubmit={handleCreateTeacher}>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                  helperText="Enter the full name of the teacher."
                />
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                  type="email"
                  helperText="Enter a valid email address."
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                  helperText="Enter a secure password."
                />
                <TextField
                  label="Course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                  helperText="Enter the course assigned to the teacher."
                />
                <TextField
                  label="Timing"
                  value={timing}
                  onChange={(e) => setTiming(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                  helperText="Enter the timing for the course."
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : "Create Teacher"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Collapse>

        {/* View Teachers Section */}
        <Collapse in={openSection === "viewTeachers"}>
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                See Teachers
              </Typography>
              {loading && <CircularProgress />}
              {!loading && teachers.length > 0 ? (
                <Grid container spacing={2}>
                  {teachers.map((teacher) => (
                    <Grid item xs={12} sm={6} md={4} key={teacher._id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">{teacher.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {teacher.email}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="subtitle1" gutterBottom>
                            Assigned Students
                          </Typography>
                          {teacher.assignedStudents?.length > 0 ? (
                            <List>
                              {teacher.assignedStudents.map((student) => (
                                <ListItem key={student._id}>
                                  {student.name} - {student.email}
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Typography variant="body2">
                              No students assigned.
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body1">No teachers available.</Typography>
              )}
            </CardContent>
          </Card>
        </Collapse>

        {/* Delete Teacher Section */}
        <Collapse in={openSection === "deleteTeacher"}>
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Delete Teacher
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Select
                fullWidth
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Teacher
                </MenuItem>
                {teachers.map((teacher) => (
                  <MenuItem key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="contained"
                color="error"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => setConfirmOpen(true)}
                disabled={!selectedTeacher}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        </Collapse>

        {/* Confirmation Dialog */}
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this teacher? This action is
              irreversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteTeacher} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
