import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import OrderGeneratorContainer from "./components/OrderGenerator/OrderGeneratorContainer.jsx";
import InventoryManager from "./components/Inventory/InventoryManager.jsx";

import Home from "./Pages/Home";
import Marketplace from "./Pages/Marketplace";
import BlockchainTrust from "./components/BlockchainTrust.jsx";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import SupplierInventory from "./components/Inventory/SupplierInventory.jsx";
import VendorOrders from "./Pages/VendorOrders";
import SupplierOrdersPage from "./Pages/SupplierOrdersPage.jsx";
import Support from "./Pages/Support.jsx";



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
