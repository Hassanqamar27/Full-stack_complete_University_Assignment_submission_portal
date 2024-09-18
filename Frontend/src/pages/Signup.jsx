import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Button,
  Container,
  Typography,
  CircularProgress,
  Box,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";
import { signup } from "../redux/slices/authSlice";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    course: "",
    timing: "",
  });

  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate("/");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(signup(formData));
      if (signup.fulfilled.match(resultAction)) {
        toast.success("Signup successful! Please verify your OTP.");
        navigate("/verify-otp", {
          state: { userId: resultAction.payload.data.email },
        });
      } else {
        toast.error(resultAction.payload || "Signup failed.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.log(error, error.message);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 4, mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create an Account
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Fill in the details to sign up for your account
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={loading}
            autoComplete="name"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={loading}
            autoComplete="email"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={loading}
            autoComplete="new-password"
          />
          <TextField
            label="Course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={loading}
          />
          <TextField
            label="Timing"
            name="timing"
            value={formData.timing}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
        </form>

        {error && (
          <Typography
            color="error"
            variant="body2"
            sx={{ mt: 2, textAlign: "center" }}
          >
            {error}
          </Typography>
        )}

        <Button
          variant="text"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleNavigateToLogin}
        >
          Already have an account? Sign In
        </Button>
      </Paper>
    </Container>
  );
};

export default Signup;
