import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Link,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box className="home-container">
      {/* Hero Section with Transparent Background Image */}
      <Box
        id="hero"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundImage:
            "url('https://scontent.fkhi2-3.fna.fbcdn.net/v/t39.30808-6/307685411_400717812239130_6667699088764675597_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeFyk56g-2WmGkZR6rDGnF8MDAaCldNHMycMBoKV00czJxHNMeJZHhXqv5rHeDKGC7r5dq30B5SgE_Ae2PVoMzng&_nc_ohc=013QbscY268Q7kNvgE5rTdW&_nc_ht=scontent.fkhi2-3.fna&_nc_gid=A6ECJ5AEuSs5y9Cwix6mumo&oh=00_AYBD_WX5j1ABHFuH537NCUovgVw1i4xHnIYGIzsBIgNYtA&oe=66E82132')", // Your background image URL
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          color: "rgb(255, 255, 255)", // White color in RGB
        }}
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Transparent Overlay to Improve Text Readability */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark transparent overlay
            zIndex: 1,
          }}
        />
        <Box sx={{ zIndex: 2 }}>
          <Typography
            variant="h2"
            component={motion.h1}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            Welcome to The University of Karachi DCS
          </Typography>
          <Typography
            variant="h6"
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Empowering future leaders through innovative education and research.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 3 }}
            onClick={() =>
              document
                .getElementById("contact")
                .scrollIntoView({ behavior: "smooth" })
            }
            component={motion.a}
            whileHover={{ scale: 1.1 }}
          >
            Get in Touch
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Container sx={{ py: 4 }} className="main-content">
        {/* About Us Section */}
        <Box id="about" className="section about" sx={{ my: 6 }}>
          <Typography variant="h4" align="center" gutterBottom>
            About Us
          </Typography>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                transition={{ duration: 1 }}
              >
                <Typography variant="body1" paragraph>
                  Karachi University is a premier institution providing
                  world-class education and research opportunities.
                </Typography>
                <Typography variant="body1" paragraph>
                  Founded in 1951, we have a long tradition of academic
                  excellence and innovation.
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.img
                src="https://scontent.fkhi2-3.fna.fbcdn.net/v/t39.30808-6/307685411_400717812239130_6667699088764675597_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeFyk56g-2WmGkZR6rDGnF8MDAaCldNHMycMBoKV00czJxHNMeJZHhXqv5rHeDKGC7r5dq30B5SgE_Ae2PVoMzng&_nc_ohc=013QbscY268Q7kNvgE5rTdW&_nc_ht=scontent.fkhi2-3.fna&_nc_gid=A6ECJ5AEuSs5y9Cwix6mumo&oh=00_AYBD_WX5j1ABHFuH537NCUovgVw1i4xHnIYGIzsBIgNYtA&oe=66E82132"
                alt="University Campus"
                className="about-image"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1 }}
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Courses Section */}
        <Box id="courses" className="section courses" sx={{ my: 6 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Our Courses
          </Typography>
          <Grid container spacing={4}>
            {["Computer Science", "Business Administration", "Engineering"].map(
              (course, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Card>
                      <CardContent>
                        <Typography variant="h5">{course}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {course === "Computer Science"
                            ? "Advanced courses in programming, data science, and AI."
                            : course === "Business Administration"
                            ? "Innovative courses in management, marketing, and entrepreneurship."
                            : "Engineering programs in civil, mechanical, and electrical engineering."}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              )
            )}
          </Grid>
        </Box>

        {/* Contact Section */}
        <Box id="contact" className="section contact" sx={{ my: 6 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            We'd love to hear from you! Reach out to us through the following
            channels:
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h6">Email</Typography>
              <Typography>vc@uok.edu.pk</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">Phone</Typography>
              <Typography>+92 21 1234 5678</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">Address</Typography>
              <Typography>
                Karachi University, University Road, Karachi, Pakistan
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Login and Register Section */}
        <Box id="login" className="section login" sx={{ my: 6 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Access your account to manage your information and view resources.
          </Typography>
          <Box textAlign="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/login")}
              sx={{ mt: 2 }}
            >
              Go to Login
            </Button>
          </Box>
        </Box>

        <Box id="register" className="section register" sx={{ my: 6 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Register
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Join our community by creating an account.
          </Typography>
          <Box textAlign="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/signup")}
              sx={{ mt: 2 }}
            >
              Go to Register
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ backgroundColor: "primary.dark", py: 4 }} className="footer">
        <Container>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ color: "rgb(255, 255, 255)" }}>
              Karachi University
            </Typography>
            <Box>
              {["Facebook", "Twitter", "LinkedIn", "Instagram"].map(
                (social) => (
                  <Link
                    key={social}
                    href={`https://${social.toLowerCase()}.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mx: 1, color: "rgb(255, 255, 255)" }}
                  >
                    {social}
                  </Link>
                )
              )}
            </Box>
          </Grid>
          <Typography
            variant="body2"
            sx={{ color: "rgb(255, 255, 255)", textAlign: "center", mt: 2 }}
          >
            &copy; {new Date().getFullYear()} Karachi University. All rights
            reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
