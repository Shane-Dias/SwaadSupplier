// src/Components/Navbar.jsx
import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [tokennew, setTokennew] = useState();
  
  // New state for Orders dropdown
  const [isOrdersDropdownOpen, setIsOrdersDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Set active item based on current path
    const path = window.location.pathname.substring(1);
    setActiveItem(path || "home");

    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token);
      setTokennew(token);
    } else {
      setLoading(false);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUserName(data.name);
        setUserRole(data.role);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserName("");
    setUserRole("");
    window.location.href = "/login";
  };

  // Handle Orders dropdown navigation
  const handleOrdersNavigation = (type) => {
    if (type === 'ai') {
      window.location.href = '/orders';
    } else {
      window.location.href = '/orders/inventory';
    }
    setIsOrdersDropdownOpen(false);
  };

  const navItems = [
    "Marketplace",
    // "Suppliers",
    ...(userRole === 'vendor' ? ["Orders"] : []), // Only show Orders if vendor
    "Community",
    "Support",
    isLoggedIn ? userName : "Login",
  ];

  if (loading) {
    return (
      <>
        <nav className="fixed w-full z-50 bg-gray-900 py-4">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                  StreetSource
                </span>
              </div>
            </div>
          </div>
        </nav>
        <div className="h-16 md:h-20"></div>
      </>
    );
  }

  return (
    <>
      <nav
        className={`
        fixed w-full z-50 transition-all duration-300
        ${
          scrolled
            ? "bg-gray-900/95 backdrop-blur-sm shadow-lg py-2"
            : "bg-gray-900 py-4"
        }
      `}
      >
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 lg:px-6">
          <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
            <div className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 py-2 px-4 rounded-xl shadow-[5px_5px_15px_rgba(0,0,0,0.4),-5px_-5px_15px_rgba(70,70,70,0.1)] border-t border-l border-gray-700">
              <a href="/" className="flex items-center gap-2">
                <span className="text-2xl">🍜</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]">
                  StreetSource
                </span>
              </a>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-200 p-2 rounded-lg hover:bg-gray-800 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-3 lg:space-x-6">
            {navItems.map((item) => (
              <li key={item} className="relative">
                {item === userName ? (
                  <div className="relative group">
                    <button
                      className={`
                        relative py-2 px-3 lg:px-4 rounded-lg transition-all duration-300 flex items-center justify-center
                        bg-gradient-to-br from-gray-800 to-gray-900 text-orange-400 
                        shadow-[inset_3px_3px_6px_rgba(0,0,0,0.35),inset_-2px_-2px_5px_rgba(80,80,80,0.05)]
                        hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25),inset_-2px_-2px_5px_rgba(70,70,70,0.05)]
                        overflow-hidden border border-gray-800 hover:border-orange-900/50
                      `}
                    >
                      <span
                        className={`
                          relative z-10 group-hover:text-orange-400 group-hover:drop-shadow-[0_0_5px_rgba(249,115,22,0.6)] 
                          transition-colors duration-300 text-sm lg:text-base font-medium
                        `}
                      >
                        {item}
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </button>
                    <div className="absolute right-0 mt-1 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-50 hidden group-hover:block">
                      <a
                        href={userRole === 'vendor' ? '/vendor-dashboard' : '/supplier-dashboard'}
                        className="block px-4 py-2 text-gray-200 hover:bg-gray-700"
                      >
                        Dashboard
                      </a>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : item === "Orders" && userRole === 'vendor' ? (
                  // Special Orders dropdown handling
                  <div className="relative group">
                    <button
                      className={`
                        relative py-2 px-3 lg:px-4 rounded-lg transition-all duration-300 flex items-center justify-center
                        ${
                          activeItem === "orders" || activeItem.startsWith("orders/")
                            ? "bg-gradient-to-br from-gray-800 to-gray-900 text-orange-400 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.35),inset_-2px_-2px_5px_rgba(80,80,80,0.05)]"
                            : "bg-gray-800/80 text-gray-300 shadow-[3px_3px_6px_rgba(0,0,0,0.25),-2px_-2px_5px_rgba(70,70,70,0.05)]"
                        }
                        hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25),inset_-2px_-2px_5px_rgba(70,70,70,0.05)]
                        overflow-hidden border border-gray-800 hover:border-orange-900/50
                      `}
                      onMouseEnter={() => setIsOrdersDropdownOpen(true)}
                      onMouseLeave={() => setIsOrdersDropdownOpen(false)}
                    >
                      <span
                        className={`
                          relative z-10 group-hover:text-orange-400 group-hover:drop-shadow-[0_0_5px_rgba(249,115,22,0.6)] 
                          transition-colors duration-300 text-sm lg:text-base font-medium flex items-center space-x-1
                        `}
                      >
                        <span>{item}</span>
                        <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>

                      {(activeItem === "orders" || activeItem.startsWith("orders/")) && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-red-500"></span>
                      )}

                      <span className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </button>

                    {/* Orders Dropdown Menu */}
                    <div 
                      className={`absolute left-0 mt-1 w-64 bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-700 transition-all duration-200 ${
                        isOrdersDropdownOpen ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-2'
                      }`}
                      onMouseEnter={() => setIsOrdersDropdownOpen(true)}
                      onMouseLeave={() => setIsOrdersDropdownOpen(false)}
                    >
                      <button
                        onClick={() => handleOrdersNavigation('ai')}
                        className="w-full text-left px-4 py-3 text-gray-200 hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-red-500/10 hover:text-orange-300 transition-all duration-200 flex items-center space-x-3"
                      >
                        <span className="text-lg">🤖</span>
                        <div>
                          <div className="font-medium">AI Generated Orders</div>
                          <div className="text-xs text-gray-400">Smart ingredient calculation</div>
                        </div>
                      </button>
                      
                      <div className="h-px bg-gray-700 mx-2"></div>
                      
                      <button
                        onClick={() => handleOrdersNavigation('manual')}
                        className="w-full text-left px-4 py-3 text-gray-200 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:text-blue-300 transition-all duration-200 flex items-center space-x-3"
                      >
                        <span className="text-lg">📦</span>
                        <div>
                          <div className="font-medium">Raw Materials Inventory</div>
                          <div className="text-xs text-gray-400">Choose items manually</div>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <a
                    href={`/${item.toLowerCase()}`}
                    onClick={() => setActiveItem(item.toLowerCase())}
                    className={`
                      relative py-2 px-3 lg:px-4 rounded-lg transition-all duration-300 flex items-center justify-center
                      ${
                        activeItem === item.toLowerCase()
                          ? "bg-gradient-to-br from-gray-800 to-gray-900 text-orange-400 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.35),inset_-2px_-2px_5px_rgba(80,80,80,0.05)]"
                          : "bg-gray-800/80 text-gray-300 shadow-[3px_3px_6px_rgba(0,0,0,0.25),-2px_-2px_5px_rgba(70,70,70,0.05)]"
                      }
                      hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25),inset_-2px_-2px_5px_rgba(70,70,70,0.05)]
                      overflow-hidden group border border-gray-800 hover:border-orange-900/50
                    `}
                  >
                    <span
                      className={`
                        relative z-10 group-hover:text-orange-400 group-hover:drop-shadow-[0_0_5px_rgba(249,115,22,0.6)] 
                        transition-colors duration-300 text-sm lg:text-base font-medium
                      `}
                    >
                      {item}
                    </span>

                    {activeItem === item.toLowerCase() && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-red-500"></span>
                    )}

                    <span className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Navigation */}
          <div className={`md:hidden w-full transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <ul className="flex flex-col space-y-2 mt-4 pb-4">
              {navItems.map((item) => (
                <li key={item}>
                  {item === userName ? (
                    <>
                      <a
                        href={userRole === 'vendor' ? '/vendor-dashboard' : '/supplier-dashboard'}
                        className="block py-3 px-4 rounded-lg transition-all duration-300 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30"
                      >
                        Dashboard
                      </a>
                      <a
                        href="/profile"
                        className="block py-3 px-4 rounded-lg transition-all duration-300 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30 mt-2"
                      >
                        Profile
                      </a>
                      <button
                        onClick={handleLogout}
                        className="w-full mt-2 py-2 px-4 text-center text-orange-300 hover:bg-orange-500/10 rounded-lg border border-orange-500/30"
                      >
                        Logout
                      </button>
                    </>
                  ) : item === "Orders" && userRole === 'vendor' ? (
                    // Mobile Orders dropdown
                    <>
                      <button
                        onClick={() => handleOrdersNavigation('ai')}
                        className="w-full text-left py-3 px-4 rounded-lg transition-all duration-300 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30 flex items-center space-x-3"
                      >
                        <span className="text-lg">🤖</span>
                        <div>
                          <div className="font-medium">AI Generated Orders</div>
                          <div className="text-xs text-orange-300/70">Smart ingredient calculation</div>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => handleOrdersNavigation('manual')}
                        className="w-full text-left py-3 px-4 rounded-lg transition-all duration-300 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30 flex items-center space-x-3 mt-2"
                      >
                        <span className="text-lg">📦</span>
                        <div>
                          <div className="font-medium">Manual Item Selection</div>
                          <div className="text-xs text-blue-300/70">Choose items manually</div>
                        </div>
                      </button>
                    </>
                  ) : (
                    <a
                      href={`/${item.toLowerCase()}`}
                      onClick={() => {
                        setActiveItem(item.toLowerCase());
                        setIsMobileMenuOpen(false);
                      }}
                      className={`
                        block py-3 px-4 rounded-lg transition-all duration-300
                        ${
                          activeItem === item.toLowerCase()
                            ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30"
                            : "bg-gray-800/50 text-gray-300 border border-gray-700/50"
                        }
                        hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-red-500/10 
                        hover:text-orange-300 hover:border-orange-500/20
                      `}
                    >
                      <span className="font-medium">{item}</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Spacer div to prevent content from being hidden behind fixed navbar */}
      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default Navbar;