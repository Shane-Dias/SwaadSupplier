import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "For Vendors",
      links: [
        { name: "Find Suppliers", href: "/suppliers" },
        { name: "Bulk Orders", href: "/bulk-orders" },
        { name: "Price Comparison", href: "/compare" },
        { name: "Vendor Registration", href: "/register-vendor" }
      ]
    },
    {
      title: "For Suppliers",
      links: [
        { name: "List Your Products", href: "/list-products" },
        { name: "Supplier Dashboard", href: "/supplier-dashboard" },
        { name: "Verification Process", href: "/verification" },
        { name: "Join as Supplier", href: "/register-supplier" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "How It Works", href: "/how-it-works" },
        { name: "Success Stories", href: "/stories" },
        { name: "Market Insights", href: "/insights" },
        { name: "Help Center", href: "/help" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "Order Tracking", href: "/track" },
        { name: "Report Issue", href: "/report" },
        { name: "FAQs", href: "/faq" }
      ]
    }
  ];

  const socialLinks = [
    { 
      name: "Twitter",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
        </svg>
      ),
      href: "https://twitter.com"
    },
    {
      name: "Instagram",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      href: "https://instagram.com"
    },
    {
      name: "LinkedIn",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
        </svg>
      ),
      href: "https://linkedin.com"
    },
    {
      name: "Facebook",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      href: "https://facebook.com"
    }
  ];

  return (
    <footer className="bg-gray-900 text-gray-200 mt-auto pt-8 pb-6 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
          {/* Logo and description */}
          <div className="col-span-2">
            <div className="mb-3">
              <div className="text-xl font-bold bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm py-1.5 px-3 rounded-lg shadow-[3px_3px_10px_rgba(0,0,0,0.4),-3px_-3px_10px_rgba(70,70,70,0.1)] border border-white/10 inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 drop-shadow-[0_0_6px_rgba(251,146,60,0.6)]">
                  SwaadSupplier
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-4 leading-relaxed">
              Bridging the gap between street food vendors and trusted suppliers. Making raw material sourcing affordable, reliable, and hassle-free for India's vibrant food culture.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="text-gray-400 hover:text-orange-400 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm p-1.5 rounded-md shadow-[2px_2px_4px_rgba(0,0,0,0.25),-1px_-1px_3px_rgba(70,70,70,0.05)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.25),inset_-1px_-1px_3px_rgba(70,70,70,0.05)] border border-gray-800 hover:border-orange-900/50 hover:scale-105"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Links sections */}
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="text-sm font-semibold mb-3 text-gray-100">{section.title}</h3>
              <ul className="space-y-1.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-xs flex items-center group"
                    >
                      <span className="mr-1.5 text-xs text-orange-500/60 group-hover:text-orange-400 transition-colors">&#9670;</span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
       
        
        {/* Copyright - More compact */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs mb-3 sm:mb-0">
            &copy; {currentYear} Team <span className='font-bold text-white'>Error999</span>  . All rights reserved. | Made with ❤️ in Mumbai
          </p>
          <div className="flex space-x-4">
            <a href="/privacy" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-xs">
              Privacy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-xs">
              Terms
            </a>
            <a href="/cookies" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-xs">
              Cookies
            </a>
            <a href="/sitemap" className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-xs">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;