// import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    // Redirect to login page
    navigate("/login");
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleLogout}
      sx={{ mt: 2 }} // Optional: Add margin top for spacing
    >
      Logout
    </Button>
  );
};

export default Logout;
