import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Avatar,
} from "@mui/material";
import { toast } from "react-toastify";
import { styled } from "@mui/material/styles";

// Styled Avatar for a professional look
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  margin: "auto",
  marginBottom: theme.spacing(2),
}));

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
  }, []);

  const validateForm = () => {
    if (!email || !password) {
      setFormError("Email or password is incorrect.");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleNavigateToSignup = () => {
    navigate("/signup");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const resultAction = await dispatch(
        loginUser({ email, password })
      ).unwrap();

      if (resultAction.status) {
        toast.success("Login successful!");
        localStorage.setItem("authToken", resultAction.token);
        localStorage.setItem("userRole", resultAction.data.role);

        const attemptedUrl = localStorage.getItem("attemptedUrl") || "/";
        navigate(attemptedUrl);
        localStorage.removeItem("attemptedUrl");

        const userRole = resultAction.data.role;
        if (userRole === "student") {
          navigate("/student-dashboard");
        } else if (userRole === "teacher") {
          navigate("/teacher-dashboard");
        } else if (userRole === "admin") {
          navigate("/admin-dashboard");
        } else {
          toast.error("Unknown user role.");
        }
      } else {
        setFormError("Email or password is incorrect.");
      }
    } catch (error) {
      setFormError("Email or password is incorrect.");
      console.log(error.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 4,
          mb: 4,
          p: 4,
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <StyledAvatar src="../../public/5.png" alt="Logo" />{" "}
          {/* Replace with your logo path */}
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Login
          </Typography>
          {formError && (
            <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
              {formError}
            </Alert>
          )}
          <form onSubmit={handleLogin} style={{ width: "100%" }}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              disabled={authLoading}
              sx={{ backgroundColor: "#f9f9f9", borderRadius: 1 }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              disabled={authLoading}
              sx={{ backgroundColor: "#f9f9f9", borderRadius: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.5 }}
              disabled={authLoading}
            >
              {authLoading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </form>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              borderColor: "primary.main",
              color: "primary.main",
            }}
            onClick={handleNavigateToSignup}
          >
            Create New Account
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
