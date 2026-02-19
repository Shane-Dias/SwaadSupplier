import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Building, Award } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Use environment variable for API access
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch(`${apiUrl}/api/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    console.error('Failed to fetch profile:', response.status);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                <p>Please log in to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-700">
                    <div className="h-32 bg-gradient-to-r from-orange-500/20 to-red-500/20 relative">
                        <div className="absolute -bottom-16 left-8">
                            <div className="h-32 w-32 rounded-full border-4 border-gray-900 bg-gray-800 flex items-center justify-center shadow-lg">
                                <span className="text-5xl">
                                    {user.role === 'vendor' ? '👨‍🍳' : '🏭'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="pt-20 pb-8 px-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{user.shopName || user.name}</h1>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${user.role === 'vendor'
                                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                        }`}>
                                        {user.role?.toUpperCase()}
                                    </span>
                                    <span className="text-gray-400">• Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => alert("Edit profile functionality coming soon!")}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors border border-gray-600"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <User className="text-orange-500" />
                            Contact Details
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 text-gray-300">
                                <User className="w-5 h-5 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">Contact Person</p>
                                    <p className="font-medium">{user.name}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-gray-300">
                                <Mail className="w-5 h-5 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">Email Address</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-gray-300">
                                <Phone className="w-5 h-5 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">Phone Number</p>
                                    <p className="font-medium">{user.mobileNo || user.phone || 'N/A'}</p>
                                </div>
                            </div>
                            {/* Add FSSAI for Suppliers */}
                            {user.role === 'supplier' && (
                                <div className="flex items-start gap-3 text-gray-300">
                                    <Award className="w-5 h-5 text-gray-500 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500">FSSAI Certificate</p>
                                        {user.fssaiCertificate ? (
                                            <a
                                                href={`${apiUrl}/${user.fssaiCertificate.replace(/\\/g, '/')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 underline"
                                            >
                                                View Certificate
                                            </a>
                                        ) : (
                                            <span className="text-gray-500 italic">Not Uploaded</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Business Details */}
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <Building className="text-orange-500" />
                            Business Info
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 text-gray-300">
                                <Building className="w-5 h-5 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">Shop/Business Name</p>
                                    <p className="font-medium">{user.shopName || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-gray-300">
                                <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">Location/Address</p>
                                    <p className="font-medium">{user.location || user.address || 'N/A'}</p>
                                </div>
                            </div>
                            {/* Additional fields if any */}
                            {user.category && (
                                <div className="flex items-start gap-3 text-gray-300">
                                    <div className="w-5 h-5 mt-1 flex items-center justify-center text-gray-500">🏷️</div>
                                    <div>
                                        <p className="text-sm text-gray-500">Category</p>
                                        <p className="font-medium capitalize">{user.category}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
