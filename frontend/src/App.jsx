import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import OrderGeneratorContainer from "./components/OrderGenerator/OrderGeneratorContainer";

import Home from "./Pages/Home";
import Marketplace from "./Pages/Marketplace";
import BlockchainTrust from "./Components/BlockchainTrust";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/orders" element={<OrderGeneratorContainer />} />
        {/* Add more routes as needed */}
        <Route path="/blockchain" element={<BlockchainTrust />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;