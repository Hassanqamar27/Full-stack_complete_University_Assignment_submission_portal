import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole");

  const handleHomeRedirect = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const handleBackRedirect = () => {
    if (userRole === "student") {
      navigate("/student-dashboard");
    } else if (userRole === "teacher") {
      navigate("/teacher-dashboard");
    } else if (userRole === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/"); // Default to home if role is unknown
    }
    localStorage.removeItem("attemptedUrl"); // Clear the attempted URLs
    // localStorage.removeItem("userRole"); // Clear the user role
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Unauthorized
        </Typography>
        <Typography variant="body1" gutterBottom>
          You do not have permission to access this page.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleHomeRedirect}
        >
          Go to Home
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mt: 2 }}
          onClick={handleBackRedirect}
        >
          Go Back
        </Button>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;
