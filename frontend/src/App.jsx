import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import OrderGeneratorContainer from "./components/OrderGenerator/OrderGeneratorContainer";
import InventoryManager from "./components/Inventory/InventoryManager";

import Home from "./Pages/Home";
import Marketplace from "./Pages/Marketplace";
import BlockchainTrust from "./Components/BlockchainTrust";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import SupplierInventory from "./Components/Inventory/SupplierInventory";



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