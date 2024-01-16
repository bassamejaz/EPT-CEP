import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
// import Navigation from "./Navigation";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import Calculate from "./components/Calculate";
import About from "./components/About";
import { useEffect, useState } from "react";

const App = () => {
  
  // console.log(isPhone);
  const appStyle = {
    backgroundColor: "black", // Set your desired background color
    minHeight: "100vh", // Ensures the background covers the entire viewport height
    padding: "20px", // Add padding if needed
  };

  return (
    <div style={appStyle}>
      <Router>
        <ResponsiveAppBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/calculate" element={<Calculate />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
