import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Button,
  Container,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";

import { verifyOtp } from "../redux/slices/authSlice";

const OtpVerify = () => {
  const [otp, setOtp] = useState("");
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state?.userId; // Change `userId` to `id` to match backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("UserID:", userId); // Check if userId is defined
    console.log("OTP:", otp); // Check the OTP value

    try {
      const resultAction = await dispatch(verifyOtp({ id: userId, otp }));
      if (verifyOtp.fulfilled.match(resultAction)) {
        toast.success("OTP verified! Redirecting to Login...");
        navigate("/login");
      } else {
        toast.error(resultAction.payload || "OTP verification failed.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error during OTP verification:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        className="bg-white shadow-lg rounded-lg p-6 "
        sx={{ position: "relative", top: 10, mt: 10 }}
      >
        <Box className="flex flex-col  justify-center items-center ">
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            className="dark:text-black"
          >
            Verify OTP
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              fullWidth
              margin="normal"
              required
              inputProps={{ maxLength: 6 }}
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading || otp.length !== 6}
            >
              {loading ? <CircularProgress size={24} /> : "Verify OTP"}
            </Button>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default OtpVerify;
