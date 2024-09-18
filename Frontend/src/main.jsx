// import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
// import { BrowserRouter as Router } from "react-router-dom";
import store from "./redux/store";
import App from "./App.jsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light", // or 'dark'
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#ffffff", // light mode background
    },
    text: {
      primary: "#000000", // light mode text color
    },
  },
  // Define dark mode theme if needed
  dark: {
    palette: {
      mode: "dark",
      primary: {
        main: "#90caf9",
      },
      background: {
        default: "#121212", // dark mode background
      },
      text: {
        primary: "#ffffff", // dark mode text color
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
      <ToastContainer />
    </ThemeProvider>
  </Provider>
);
