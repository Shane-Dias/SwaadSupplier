import React, { useState } from 'react';
import { Star, X, Upload, Loader } from 'lucide-react';

const RatingModal = ({ isOpen, onClose, onSubmit, orderId, supplierName }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [image, setImage] = useState(null); // In real implementation, this would be a file upload logic
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return alert("Please select a star rating");

        setSubmitting(true);
        await onSubmit({ orderId, rating, comment, image });
        setSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700 shadow-xl overflow-hidden animate-fadeIn">

                {/* Header */}
                <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-white">Rate Delivery</h2>
                        <p className="text-sm text-gray-400 mt-1">Order from <span className="text-orange-400 font-medium">{supplierName}</span></p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Star Rating */}
                    <div className="flex flex-col items-center gap-3">
                        <p className="text-gray-300 font-medium">How was your experience?</p>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <Star
                                        size={32}
                                        className={`${star <= (hoverRating || rating)
                                                ? "fill-orange-400 text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                                                : "text-gray-600"
                                            } transition-all duration-200`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-orange-400 font-medium h-5">
                            {rating === 1 && "Terrible 😠"}
                            {rating === 2 && "Bad 😞"}
                            {rating === 3 && "Okay 😐"}
                            {rating === 4 && "Good 🙂"}
                            {rating === 5 && "Excellent! 🤩"}
                        </p>
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Your Review</label>
                        <textarea
                            required
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell others about the product quality and delivery..."
                            className="w-full h-32 bg-gray-900/50 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                        />
                    </div>

                    {/* Photo Upload (Mock UI) */}
                    <div className="border-2 border-dashed border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-500 text-gray-400 hover:text-gray-300 transition-all bg-gray-900/30">
                        <Upload size={24} />
                        <span className="text-sm">Upload a photo (optional)</span>
                        <input type="file" className="hidden" accept="image/*" />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader className="animate-spin" size={20} />
                                Submitting...
                            </>
                        ) : (
                            "Submit Verified Review"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RatingModal;
