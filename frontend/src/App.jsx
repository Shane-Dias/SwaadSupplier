import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import OrderGeneratorContainer from "./generateOrder/OrderGeneratorContainer.jsx";
import InventoryManager from "./inventory/InventoryManager.jsx";

import Home from "./page/Home.jsx";
import BlockchainTrust from "./components/BlockchainTrust.jsx";
import Signup from "./page/Signup.js";
import Login from "./page/Login.js";
import SupplierInventory from "./inventory/SupplierInventory.js";
import VendorOrders from "./page/VendorOrders.jsx";
import SupplierOrdersPage from "./page/SupplierOrdersPage.js";
import Support from "./page/Support.js";
import Marketplace from "../src/page/Marketplace.js";



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
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vendor-dashboard" element={<VendorOrders />} />
        <Route
          path="/supplier/inventory/supplier/orders"
          element={<SupplierOrdersPage />}
        />
        <Route path='/signup' element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/support" element={<Support/>}/>
        {/* Add more routes as needed */}
        <Route path="/community" element={<BlockchainTrust />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
