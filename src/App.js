import React, { Suspense, lazy } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
function App() {
  return (
      <div className="appStyle">
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/Register" element={<Register />} />
            </Routes>
          </Suspense>
        </Router>
    </div>
  );
}

export default App;
