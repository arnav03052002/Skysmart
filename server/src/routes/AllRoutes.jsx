import Footer from "../Pages/Footer";
import Navbar from "../Pages/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";

import Signin from "../Pages/Signin";
import Signup from "../Pages/Signup";
import AboutUs from "../Pages/AboutUs";

function AllRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/about" element={<AboutUs/>} />
      </Routes>
      <Footer />
    </>
  );
}

export default AllRoutes;
