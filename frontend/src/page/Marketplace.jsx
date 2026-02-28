import React, { useState, useEffect } from "react";
import {
  CreditCard, TrendingUp, AlertCircle, CheckCircle, Clock,
  DollarSign, Shield, Users, Wallet, Send, Phone, RefreshCcw
} from "lucide-react";

const Marketplace = () => {
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vendor State
  const [creditScore, setCreditScore] = useState(500);
  const [totalDue, setTotalDue] = useState(0);
  const [creditLimit, setCreditLimit] = useState(20000);
  const [vendorTransactions, setVendorTransactions] = useState([]);

  // Supplier State
  const [totalReceivables, setTotalReceivables] = useState(0);
  const [activeVendors, setActiveVendors] = useState(0);
  const [vendorDebts, setVendorDebts] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch Role & Data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Get Role
      const roleRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!roleRes.ok) throw new Error("Failed to fetch user role");
      const roleData = await roleRes.json();
      const role = roleData.role;
      setUserRole(role);

      // 2. Fetch Dashboard Data based on Role
      if (role === 'vendor') {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/credit/vendor-summary`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch credit stats");
        const data = await res.json();
        setCreditScore(data.trustScore);
        setCreditLimit(data.creditLimit);
        setTotalDue(data.totalDue);
        setVendorTransactions(data.transactions);

      } else if (role === 'supplier') {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/credit/supplier-summary`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch collections");
        const data = await res.json();
        setTotalReceivables(data.totalReceivables);
        setActiveVendors(data.activeVendors);
        setVendorDebts(data.vendorDebts);
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
    else setLoading(false);
  }, [token]);

  const calculateProgress = (score) => ((score - 300) / 550) * 100;

  const handleVendorPay = async (orderId) => {
    if (!window.confirm("Confirm Payment via Swaad Wallet?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/credit/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderId })
      });

      if (!res.ok) throw new Error("Payment Failed");

      alert("Payment Successful! Trust Score Updated 🚀");
      fetchData(); // Refresh data

    } catch (err) {
      alert(err.message);
    }
  };

  const handleSendReminder = async (vendorId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/credit/remind`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ vendorId })
      });
      if (res.ok) alert(`Reminder sent successfully! 📲`);
    } catch (err) {
      alert("Failed to send reminder");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p>Loading Credit Dashboard...</p>
      </div>
    </div>
  );

  if (!token) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Please Login</h2>
        <p className="text-gray-400">You need to be logged in to access the credit system.</p>
        <a href="/login" className="mt-4 inline-block bg-orange-500 px-6 py-2 rounded-lg">Login</a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg text-red-200 flex justify-between items-center">
            <span>Error: {error}</span>
            <button onClick={fetchData} className="bg-red-500/20 px-3 py-1 rounded hover:bg-red-500/30">Retry</button>
          </div>
        )}

        {/* ==============================================================================================
                                      VENDOR VIEW
           ============================================================================================== */}
        {userRole === 'vendor' ? (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-500 bg-clip-text text-transparent">
                  My Khata & Credit
                </h1>
                <p className="text-gray-400">Build trust, get more credit.</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={fetchData} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 tooltip" title="Refresh">
                  <RefreshCcw size={18} />
                </button>
                <div className="bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20 text-green-400 font-bold">
                  Limit: ₹{creditLimit.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Score Card */}
              <div className="bg-gray-800 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <h3 className="text-gray-400 font-medium mb-4">Swaad Trust Score</h3>
                <div className="flex items-end gap-3 mb-4">
                  <span className="text-5xl font-bold text-white">{creditScore}</span>
                  <span className="text-green-500 mb-2 font-medium">Excellent</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500" style={{ width: `${calculateProgress(creditScore)}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Unverified (300)</span>
                  <span>Trusted (850)</span>
                </div>
              </div>

              {/* Due Card */}
              <div className="bg-gray-800 border border-white/10 p-6 rounded-2xl">
                <h3 className="text-gray-400 font-medium mb-4">Outstanding Dues</h3>
                <div className="text-4xl font-bold text-white mb-2">₹{totalDue.toLocaleString()}</div>
                <div className="flex gap-2 mt-4">
                  {totalDue > 0 ? (
                    <div className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm flex items-center gap-1">
                      <AlertCircle size={14} /> Payments Due
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm flex items-center gap-1">
                      <CheckCircle size={14} /> All All Clear
                    </div>
                  )}
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold mt-8">Recent Transactions</h3>
            <div className="space-y-3">
              {vendorTransactions.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No transaction history found.</div>
              ) : (
                vendorTransactions.map(tx => (
                  <div key={tx.id} className="bg-gray-800/40 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-gray-800/60 transition-colors">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className={`p-3 rounded-full flex-shrink-0 ${tx.status === 'Paid' ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}`}>
                        {tx.status === 'Paid' ? <CheckCircle size={20} /> : <Clock size={20} />}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold truncate">{tx.supplier}</div>
                        <div className="text-sm text-gray-400 truncate">{tx.items}</div>
                        {tx.status !== 'Paid' && <div className="text-xs text-red-400 mt-1">Due: {new Date(tx.dueDate).toLocaleDateString()}</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <div className="font-bold text-lg">₹{tx.amount}</div>
                        <div className={`text-xs font-bold uppercase ${tx.status === 'Overdue' ? 'text-red-400' : tx.status === 'Due' ? 'text-orange-400' : 'text-green-400'}`}>{tx.status}</div>
                      </div>
                      {tx.status !== 'Paid' && (
                        <button
                          onClick={() => handleVendorPay(tx.id)}
                          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium text-sm shadow-lg shadow-blue-600/20"
                        >
                          Pay
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          /* ==============================================================================================
                                        SUPPLIER VIEW
             ============================================================================================== */
          <>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Credit Management
                </h1>
                <p className="text-gray-400">Track collections and manage vendor risk.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={fetchData} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 tooltip" title="Refresh">
                  <RefreshCcw size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-2xl border border-white/10">
                <div className="text-gray-400 text-sm">Total Market Receivables</div>
                <div className="text-3xl font-bold text-white mt-2">₹{totalReceivables.toLocaleString()}</div>
              </div>
              <div className="bg-gray-800 p-6 rounded-2xl border border-white/10">
                <div className="text-gray-400 text-sm">Active Credit Vendors</div>
                <div className="text-3xl font-bold text-white mt-2">{activeVendors}</div>
              </div>
              <div className="bg-gray-800 p-6 rounded-2xl border border-red-500/30 bg-red-500/5">
                <div className="text-red-300 text-sm">Risk Assessment</div>
                <div className="text-xl font-bold text-red-500 mt-2">
                  {vendorDebts.filter(v => v.trustScore < 400).length} High Risk
                </div>
                <div className="text-red-400 text-xs mt-1">Vendors with Low Trust Score</div>
              </div>
            </div>

            <h3 className="text-xl font-bold mt-8">Vendor Credit List</h3>
            <div className="space-y-3">
              {vendorDebts.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No active debts found.</div>
              ) : (
                vendorDebts.map(vendor => (
                  <div key={vendor.id} className="bg-gray-800/40 p-4 rounded-xl border border-white/5 hover:bg-gray-800 transition-colors flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 ${vendor.trustScore > 750 ? 'border-green-500/50 bg-green-500/20 text-green-500' :
                          vendor.trustScore > 500 ? 'border-yellow-500/50 bg-yellow-500/20 text-yellow-500' : 'border-red-500/50 bg-red-500/20 text-red-500'
                        }`}>
                        {vendor.trustScore}
                      </div>
                      <div>
                        <div className="font-bold text-lg">{vendor.name}</div>
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                          <Phone size={12} /> {vendor.phone}
                        </div>
                      </div>
                    </div>

                    <div className="text-right min-w-[120px]">
                      <div className="text-gray-400 text-xs">Total Due</div>
                      <div className={`text-xl font-bold ${vendor.due > 0 ? 'text-white' : 'text-gray-500'}`}>
                        ₹{vendor.due.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {vendor.due > 0 ? (
                        <button onClick={() => handleSendReminder(vendor.id)} className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-500 hover:bg-green-600/30 rounded-lg transition-colors border border-green-600/30">
                          <Send size={16} /> Remind
                        </button>
                      ) : (
                        <span className="text-green-500 font-bold px-4 flex items-center gap-1">
                          <CheckCircle size={16} /> Paid
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Marketplace;