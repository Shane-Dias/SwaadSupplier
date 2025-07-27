import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import OrderGeneratorContainer from "./components/OrderGenerator/OrderGeneratorContainer.jsx";
import InventoryManager from "./components/Inventory/InventoryManager.jsx";

import Home from "./Pages/Home.jsx";
import Marketplace from "./Pages/Marketplace.jsx";
import BlockchainTrust from "./Components/BlockchainTrust.jsx";
import Signup from "./Pages/Signup.jsx";
import Login from "./Pages/Login.jsx";
import SupplierInventory from "./Components/Inventory/SupplierInventory.jsx";



function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/orders" element={<OrderGeneratorContainer />} />
        <Route path="/orders/inventory" element={<InventoryManager />} />
        <Route path="/supplier/inventory" element={<SupplierInventory />} />
        <Route path='/signup' element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        {/* Add more routes as needed */}
        <Route path="/community" element={<BlockchainTrust />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;