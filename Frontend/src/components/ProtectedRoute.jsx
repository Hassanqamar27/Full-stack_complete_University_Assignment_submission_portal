import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const attemptedUrl = window.location.pathname;

    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        // Token expired
        localStorage.removeItem("authToken");
        navigate("/login");
        return;
      }

      // Check if the role is allowed
      if (allowedRoles && !allowedRoles.includes(decodedToken.role)) {
        localStorage.setItem("attemptedUrl", attemptedUrl); // Store attempted URL
        localStorage.setItem("userRole", decodedToken.role); // Store user role
        navigate("/unauthorized");
        return;
      }
    } else {
      navigate("/login");
    }
  }, [navigate, allowedRoles]);

  return children;
};

export default ProtectedRoute;
