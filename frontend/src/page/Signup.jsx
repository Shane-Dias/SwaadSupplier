import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Signup = () => {
  const [userType, setUserType] = useState('vendor');
  const [formData, setFormData] = useState({
    name: '',
    shopName: '',
    email: '',
    mobileNo: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [fssaiCertificate, setFssaiCertificate] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFssaiCertificate(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = userType === 'vendor' ? 'register/vendor' : 'register/supplier';
      
      if (userType === 'vendor') {
        const { confirmPassword, ...vendorData } = formData;
        
        const response = await fetch(`${apiUrl}/api/auth/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(vendorData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          if (key !== 'confirmPassword') {
            formDataToSend.append(key, formData[key]);
          }
        });

        if (fssaiCertificate) {
          formDataToSend.append('fssaiCertificate', fssaiCertificate);
        }

        const response = await fetch(`${apiUrl}/api/auth/${endpoint}`, {
          method: 'POST',
          body: formDataToSend,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        localStorage.setItem('token', data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 py-3 px-6 rounded-xl shadow-[5px_5px_15px_rgba(0,0,0,0.4),-5px_-5px_15px_rgba(70,70,70,0.1)] border-t border-l border-gray-700 inline-block">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">🍜</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]">
                SwaadSupplier
              </span>
            </a>
          </div>
        </div>

        <h2 className="text-center text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-red-400">
          Create an account
        </h2>
        
        <div className="mt-4 flex justify-center bg-gray-800/50 rounded-lg p-1 shadow-inner">
          <button
            onClick={() => setUserType('vendor')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${userType === 'vendor' ? 'bg-gradient-to-r from-orange-500/80 to-red-500/80 text-white shadow-md' : 'bg-transparent text-gray-300'}`}
          >
            Vendor
          </button>
          <button
            onClick={() => setUserType('supplier')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${userType === 'supplier' ? 'bg-gradient-to-r from-orange-500/80 to-red-500/80 text-white shadow-md' : 'bg-transparent text-gray-300'}`}
          >
            Supplier
          </button>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-sm py-8 px-6 shadow-xl sm:rounded-lg sm:px-10 border border-gray-700/50">
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 text-red-300 rounded-md border border-red-700/50">
              {error}
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700/50 border border-gray-600/50 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="shopName" className="block text-sm font-medium text-gray-300 mb-1">
                Shop Name
              </label>
              <input
                id="shopName"
                name="shopName"
                type="text"
                required
                value={formData.shopName}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700/50 border border-gray-600/50 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700/50 border border-gray-600/50 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-300 mb-1">
                Mobile Number
              </label>
              <input
                id="mobileNo"
                name="mobileNo"
                type="tel"
                required
                value={formData.mobileNo}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700/50 border border-gray-600/50 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700/50 border border-gray-600/50 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700/50 border border-gray-600/50 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700/50 border border-gray-600/50 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 placeholder-gray-400"
              />
            </div>

            {userType === 'supplier' && (
              <div>
                <label htmlFor="fssaiCertificate" className="block text-sm font-medium text-gray-300 mb-1">
                  FSSAI Certificate (PDF/Image)
                </label>
                <div className="mt-1 flex items-center">
                  <label className="flex flex-col items-center justify-center w-full bg-gray-700/50 border border-gray-600/50 rounded-md cursor-pointer hover:bg-gray-700/70">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                      <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        PDF, JPG, or PNG (MAX. 5MB)
                      </p>
                    </div>
                    <input 
                      id="fssaiCertificate" 
                      name="fssaiCertificate" 
                      type="file" 
                      required 
                      onChange={handleFileChange} 
                      accept=".pdf,.jpg,.jpeg,.png" 
                      className="hidden" 
                    />
                  </label>
                </div>
                {fssaiCertificate && (
                  <p className="mt-2 text-sm text-green-400">
                    Selected: {fssaiCertificate.name}
                  </p>
                )}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </>
                ) : 'Register'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800/50 text-gray-400">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate('/login')}
                className="w-full flex justify-center py-2 px-4 border border-gray-600/50 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-700/50 hover:bg-gray-700/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500/50 transition-all duration-200"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;