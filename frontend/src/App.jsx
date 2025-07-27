import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import OrderGeneratorContainer from "./generateOrder/OrderGeneratorContainer.jsx";
import InventoryManager from "./inventory/InventoryManager.jsx";
import SupplierInventory from "./inventory/SupplierInventory.jsx";

import Home from "./page/Home.jsx";
import Login from "./page/Login.jsx";
import VendorOrders from "./page/VendorOrders.jsx";
import SupplierOrdersPage from "./page/SupplierOrdersPage.jsx";
import Support from "./page/Support.jsx";
import Marketplace from "../src/page/Marketplace.jsx";
import Signup from "./page/Signup.jsx";
import BlockchainTrust from "./components/Blockchain.jsx";



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
