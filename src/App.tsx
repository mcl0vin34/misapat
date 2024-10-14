import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "../src/router/AppRouter";
import "./index.css";
import "./App.scss";

const App: React.FC = () => {
  return (
    <Router basename="/misapat">
      <AppRouter />
    </Router>
  );
};

export default App;
