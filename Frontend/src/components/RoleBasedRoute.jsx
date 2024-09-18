import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleBasedRoute = ({ element, role, ...rest }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      element={user && user.role === role ? element : <Navigate to="/login" />}
    />
  );
};

export default RoleBasedRoute;
