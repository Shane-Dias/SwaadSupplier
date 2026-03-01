import { useEffect, useState } from "react";
import Landing from "../Components/Landing";
import Features from "../Components/Features";
import Testimony from "../Components/Testimony";
import Perform from "../Components/Perform";

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${apiUrl}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Failed to load user for home view", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (user) {
    const isVendor = user.role === "vendor";
    const primaryCta = isVendor ? "/vendor-dashboard" : "/supplier/inventory/supplier/orders";
    const secondaryCta = isVendor ? "/orders" : "/supplier/inventory";

    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <section className="bg-gradient-to-br from-orange-500/10 via-gray-900 to-gray-900 border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-6 py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gray-800/70 border border-gray-700 shadow-lg">
                <span className="text-2xl">{isVendor ? "👨‍🍳" : "🏭"}</span>
                <span className="text-sm font-semibold uppercase tracking-widest text-orange-300">
                  {user.role}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                Welcome back, {user.name}
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl">
                {isVendor
                  ? "Jump into your vendor tools to generate AI-backed orders, track deliveries, and manage inventory in one place."
                  : "Review incoming orders, update stock, and keep your verified supplier profile in top shape."}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={primaryCta}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-lg hover:shadow-orange-500/30 transition"
                >
                  {isVendor ? "Go to Vendor Dashboard" : "Go to Supplier Orders"}
                  <span aria-hidden>→</span>
                </a>
                <a
                  href={secondaryCta}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 hover:border-orange-500/50 transition"
                >
                  {isVendor ? "Create AI Order" : "Manage Inventory"}
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-300">
                <div className="p-4 rounded-lg bg-gray-800/60 border border-gray-700">
                  <p className="text-gray-400">Shop</p>
                  <p className="font-semibold text-white">{user.shopName || "Not provided"}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-800/60 border border-gray-700">
                  <p className="text-gray-400">Email</p>
                  <p className="font-semibold text-white">{user.email}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-800/60 border border-gray-700">
                  <p className="text-gray-400">Role</p>
                  <p className="font-semibold text-white capitalize">{user.role}</p>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur shadow-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Quick status</p>
                    <p className="text-lg font-semibold text-white">{user.shopName || user.name}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-300 border border-orange-500/30">
                    {user.role}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-4 rounded-lg bg-gray-800/70 border border-gray-700">
                    <p className="text-gray-400">Location</p>
                    <p className="font-semibold text-white">{user.address || "Add address"}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-800/70 border border-gray-700">
                    <p className="text-gray-400">Contact</p>
                    <p className="font-semibold text-white">{user.mobileNo || "Update phone"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <a
                    href="/profile"
                    className="p-4 rounded-lg bg-gradient-to-r from-orange-500/15 to-red-500/15 border border-orange-500/30 text-orange-200 hover:border-orange-400/60 transition flex items-center justify-between"
                  >
                    <span>View Profile</span>
                    <span aria-hidden>→</span>
                  </a>
                  <a
                    href={isVendor ? "/orders/inventory" : "/supplier/inventory"}
                    className="p-4 rounded-lg bg-gray-800/70 border border-gray-700 text-gray-100 hover:border-gray-500 transition flex items-center justify-between"
                  >
                    <span>{isVendor ? "Manage Stock" : "Update Stock"}</span>
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <Landing />
      <Features />
      <Perform />
      <Testimony />
    </div>
  );
};

export default Home;
