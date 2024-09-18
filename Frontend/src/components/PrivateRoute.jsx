import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ element, ...rest }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Route {...rest} element={user ? element : <Navigate to="/login" />} />
  );
};

export default PrivateRoute;
