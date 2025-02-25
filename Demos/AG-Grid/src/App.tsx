/** @format */

import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";

import "./App.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

import Projects from "./components/Projects";
import TablesList from "./components/TablesList";
import TableComponent from "./components/TableComponent";

import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#003092",
    },
    secondary: {
      main: "#00879E",
    },
    error: {
      main: "#FFAB5B",
    },
    background: {
      default: "#FFF2DB",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h5: {
      fontWeight: 600,
      color: "#122740",
    },
    body1: {
      fontWeight: 400,
    },
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          margin: "8px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: "auto",
          transition: "0.3s",
          boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
          "&:hover": {
            boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter>
          {" "}
          {/* Use BrowserRouter for routing */}
          <div>
            <Routes>
              {" "}
              <Route path="/" element={<TablesList />} />
              <Route
                path="/table/:tableId"
                element={<TableComponent />}
              />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
