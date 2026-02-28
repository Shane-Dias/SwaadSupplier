import React, { useState, useEffect } from 'react';
import { Star, User, MessageSquare, Quote, ShoppingBag, Store, CheckCircle, TrendingUp, Award, Loader2 } from 'lucide-react';

const Community = () => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchReviews(1), fetchStats(), fetchLeaderboard()]);
            setLoading(false);
        };
        fetchData();
    }, []);

    const fetchReviews = async (pageNum = 1) => {
        try {
            if (pageNum > 1) setLoadingMore(true);

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/all?page=${pageNum}&limit=9`);
            const data = await response.json();

            if (pageNum === 1) {
                setReviews(data.reviews);
            } else {
                setReviews(prev => [...prev, ...data.reviews]);
            }

            setTotalPages(data.totalPages);
            setPage(pageNum);

        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (page < totalPages) {
            fetchReviews(page + 1);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/stats`);
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/leaderboard`);
            const data = await response.json();
            setLeaderboard(data);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const StatCard = ({ icon: Icon, label, value, subtext, color }) => (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 flex flex-col justify-between hover:border-gray-600 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-opacity-10 ${color.bg}`}>
                    <Icon size={24} className={color.text} />
                </div>
                {/* <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">+12%</span> */}
            </div>
            <div>
                <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
                <p className="text-sm text-gray-400 font-medium">{label}</p>
                {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
            </div>
        </div>
    );

    const getSentimentBadge = (rating) => {
        if (rating >= 4) return <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-[10px] border border-green-500/20">Positive</span>;
        if (rating === 3) return <span className="bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded text-[10px] border border-yellow-500/20">Neutral</span>;
        return <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-[10px] border border-red-500/20">Critical</span>;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header Section */}
                <div className="text-center space-y-4 animate-fadeIn">
                    <div className="inline-block p-3 rounded-full bg-orange-500/10 mb-2">
                        <MessageSquare className="text-orange-500 w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
                        Community Trust
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Real data, real reviews. Verified metrics from the SwaadSupplier ecosystem.
                    </p>
                </div>

                {/* Stats Dashboard */}
                {!loading && stats && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                        <StatCard
                            icon={Store}
                            label="Verified Suppliers"
                            value={stats.totalSuppliers}
                            subtext="Active on platform"
                            color={{ bg: "bg-blue-500", text: "text-blue-500" }}
                        />
                        <StatCard
                            icon={CheckCircle}
                            label="Total Platform Deliveries"
                            value={stats.totalDelivered}
                            subtext="All time across SwaadSupplier"
                            color={{ bg: "bg-green-500", text: "text-green-500" }}
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Avg Platform Rating"
                            value={stats.avgPlatformRating}
                            subtext="Across all suppliers"
                            color={{ bg: "bg-orange-500", text: "text-orange-500" }}
                        />
                        <StatCard
                            icon={Award}
                            label="Top Supplier"
                            value={stats.topSupplier?.shopName || "N/A"}
                            subtext={`${stats.topSupplier?.rating || 0} ⭐ (${stats.topSupplier?.reviewCount || 0} reviews)`}
                            color={{ bg: "bg-purple-500", text: "text-purple-500" }}
                        />
                    </div>
                )}

                {/* Rating Breakdown Section (Bonus) */}
                {!loading && stats && stats.ratingBreakdown && (
                    <div className="animate-fadeIn" style={{ animationDelay: '150ms' }}>
                        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 max-w-3xl mx-auto">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <TrendingUp className="text-orange-400" size={20} /> Rating Distribution
                            </h3>
                            <div className="space-y-3">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = stats.ratingBreakdown[star] || 0;
                                    const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                                    return (
                                        <div key={star} className="flex items-center gap-3 text-sm">
                                            <div className="flex items-center gap-1 w-12 text-gray-400 font-medium">
                                                {star} <Star size={12} className="fill-gray-600 text-gray-600" />
                                            </div>
                                            <div className="flex-grow h-3 bg-gray-700/50 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${star >= 4 ? 'bg-green-500' : star === 3 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <div className="w-12 text-right text-gray-400">
                                                {Math.round(percentage)}%
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Leaderboard Section */}
                {!loading && leaderboard.length > 0 && (
                    <div className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
                        <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-yellow-500 flex items-center gap-2">
                            <Award className="text-yellow-500" /> Top Suppliers Leaderboard
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {leaderboard.map((supplier, index) => (
                                <div key={supplier._id} className={`relative bg-gray-800/60 border ${index === 0 ? 'border-yellow-500/50 shadow-yellow-500/20' : index === 1 ? 'border-gray-400/50' : index === 2 ? 'border-orange-700/50' : 'border-gray-700'} border rounded-xl p-4 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 shadow-lg`}>

                                    {/* Rank Badge */}
                                    <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${index === 0 ? 'bg-yellow-500 text-black' :
                                        index === 1 ? 'bg-gray-300 text-black' :
                                            index === 2 ? 'bg-orange-700 text-white' :
                                                'bg-gray-700 text-white'
                                        }`}>
                                        #{index + 1}
                                    </div>

                                    {/* Icon */}
                                    <div className="mb-3">
                                        {index === 0 ? <span className="text-4xl">👑</span> :
                                            index === 1 ? <span className="text-4xl">🥈</span> :
                                                index === 2 ? <span className="text-4xl">🥉</span> :
                                                    <span className="text-4xl">🏅</span>}
                                    </div>

                                    <h3 className="font-bold text-lg text-white truncate w-full">{supplier.shopName}</h3>

                                    <div className="flex items-center gap-1 mt-2 mb-1">
                                        <span className="font-bold text-orange-400 text-lg">{supplier.rating}</span>
                                        <Star size={16} className="fill-orange-400 text-orange-400" />
                                    </div>

                                    <p className="text-xs text-gray-400">{supplier.reviewCount} Verified Reviews</p>

                                    {/* Verification Badge */}
                                    {index < 3 && (
                                        <div className="mt-3 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] text-green-400 flex items-center gap-1">
                                            <CheckCircle size={10} /> Trusted Partner
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reviews Grid */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white pl-2 border-l-4 border-orange-500">Recent Verified Reviews</h2>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-64 bg-gray-800/50 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-20 bg-gray-800/30 rounded-3xl border border-gray-700/50">
                            <div className="text-6xl mb-4">😶</div>
                            <h3 className="text-2xl font-bold text-gray-300">No Reviews Yet</h3>
                            <p className="text-gray-400 mt-2">Be the first to share your experience!</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {reviews.map((review, index) => (
                                    <div
                                        key={review._id}
                                        className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 flex flex-col"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        {/* Review Header - User Info */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                                                    {review.reviewer?.shopName?.charAt(0) || <User size={18} />}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-200 text-sm">{review.reviewer?.shopName || 'Unknown Vendor'}</h3>
                                                    <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {getSentimentBadge(review.rating)}
                                                <div className="bg-green-500/10 border border-green-500/20 px-2 py-1 rounded text-xs font-medium text-green-400 flex items-center gap-1">
                                                    <ShoppingBag size={10} /> Verified
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex gap-1 mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={`${i < review.rating ? "fill-orange-400 text-orange-400" : "text-gray-700"}`}
                                                />
                                            ))}
                                        </div>

                                        {/* Comment */}
                                        <div className="relative flex-grow">
                                            <Quote className="absolute -top-2 -left-2 text-gray-700/50 w-8 h-8 transform -scale-x-100" />
                                            <p className="text-gray-300 text-sm leading-relaxed pl-4 relative z-10 italic">
                                                "{review.comment}"
                                            </p>
                                        </div>

                                        {/* Footer - Supplier Info */}
                                        <div className="mt-6 pt-4 border-t border-gray-700/50 flex items-center justify-between text-xs">
                                            <span className="text-gray-500">Ordered from:</span>
                                            <span className="text-orange-400 font-medium bg-orange-400/10 px-2 py-1 rounded">
                                                {review.supplier?.shopName || 'Unknown Supplier'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Load More */}
                            {page < totalPages && (
                                <div className="text-center pt-8">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                        className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-medium transition-all duration-300 border border-gray-700 hover:border-orange-500 flex items-center justify-center mx-auto gap-2 disabled:opacity-50"
                                    >
                                        {loadingMore ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} /> Loading...
                                            </>
                                        ) : (
                                            "Load More Reviews"
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Community;
