import React, { useState, useEffect, useRef } from 'react';

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);
  
  // Testimonials data with specific glow colors
  const testimonials = [
    {
      quote: "StreetSource ne mere business ko transform kar diya! Ab main high quality ingredients kam price mein mil jaate hain. Mere customers bhi khush hain aur profit bhi badh gaya hai.",
      author: "Rajesh Kumar",
      position: "Chaat Vendor, Mumbai",
      image: "/api/placeholder/80/80",
      glowColor: "from-orange-600/20 to-red-400/20", // Orange to red gradient glow
      location: "🏙️ Mumbai"
    },
    {
      quote: "Pehle main subah 5 baje uthkar sabzi mandi jaata tha ingredients ke liye. Ab StreetSource se order kar deta hun aur fresh vegetables seedha stall par aa jaati hain. Time aur paise dono ki bachत हुई है।",
      author: "Priya Sharma",
      position: "South Indian Food Vendor",
      image: "/api/placeholder/80/80",
      glowColor: "from-green-600/20 to-emerald-400/20", // Green to emerald gradient glow
      location: "🌆 Delhi"
    },
    {
      quote: "Group ordering feature se main aur mere area ke vendors saath mein bulk order karte hain. Isse humein better rates milte hain aur delivery charge bhi share hota hai. Bahut helpful platform hai!",
      author: "Mohammed Ali",
      position: "Biryani & Kebab Specialist",
      image: "/api/placeholder/80/80",
      glowColor: "from-purple-600/20 to-violet-400/20", // Purple to violet gradient glow
      location: "🌃 Hyderabad"
    }
  ];

  // Handle scroll-based animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  return (
    <section 
      ref={sectionRef}
      className="py-16 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
      
      <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl animate-pulse" 
           style={{animationDuration: '15s'}} />
      <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-red-500/10 blur-3xl animate-pulse" 
           style={{animationDuration: '20s'}} />
      
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-grid-white/[0.025] bg-[length:50px_50px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-10 transition-all duration-1000 transform ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <span className="inline-block py-1 px-3 rounded-full bg-orange-500/10 text-orange-400 text-xs font-medium mb-3">
            🍜 Vendor Stories
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">Success Stories from Our Vendors</h2>
          <p className="text-white/60 max-w-xl mx-auto text-sm">Real experiences from street food vendors who transformed their business with StreetSource.</p>
        </div>
        
        <div className={`max-w-4xl mx-auto relative transition-all duration-1000 transform ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
        }`} style={{ transitionDelay: '300ms' }}>
          {/* Main card with dynamic glow effect based on active testimonial */}
          <div className="relative bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-xl border border-white/5 overflow-hidden">
            {/* Dynamic glow effect that changes with each testimonial */}
            <div className={`absolute inset-0 bg-gradient-to-br ${testimonials[activeIndex].glowColor} opacity-30 blur-xl`} />
            <div className="absolute inset-0 bg-black/50" />
            
            {/* Animated ring around the card */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl animate-pulse" 
                 style={{animationDuration: '3s'}} />
            
            {/* Content container with z-index to appear above backgrounds */}
            <div className="relative z-10">
              {/* Food quote icon */}
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🗣️</span>
              </div>
              
              <div className="min-h-40">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-1000 ${
                      index === activeIndex ? 'opacity-100 block' : 'opacity-0 hidden'
                    }`}
                  >
                    <blockquote className="text-base md:text-lg text-white font-light leading-relaxed mb-6 relative italic">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center">
                        {/* Glowing avatar border that matches testimonial color */}
                        <div className={`p-0.5 rounded-full bg-gradient-to-r ${testimonial.glowColor.replace("/20", "")} mr-4 shadow-lg`}>
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-gray-700 flex items-center justify-center">
                            <span className="text-2xl">👨‍🍳</span>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-white text-base">{testimonial.author}</div>
                          <div className="text-orange-400/80 text-sm">{testimonial.position}</div>
                          <div className="text-white/60 text-xs mt-1">{testimonial.location}</div>
                        </div>
                      </div>
                      
                      {/* Rating stars */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-lg">⭐</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-6 gap-2">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`transition-all ${
                      index === activeIndex 
                        ? `w-10 h-1 bg-gradient-to-r ${testimonial.glowColor.replace("/20", "")}`
                        : 'w-8 h-1 bg-white/20'
                    } rounded-full`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Glowing stats cards */}
          <div className={`grid grid-cols-3 gap-3 mt-6 transition-all duration-1000 transform ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`} style={{ transitionDelay: '600ms' }}>
            {/* Each stat card has its own glow color */}
            <div className="relative group overflow-hidden">
              {/* Orange glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/30 to-red-400/30 blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 border border-white/5 shadow-lg group-hover:border-orange-500/20 transition-all duration-500">
                <div className="text-lg font-bold text-white">4.8⭐</div>
                <div className="text-white/60 text-xs">Average Rating</div>
              </div>
            </div>
            
            <div className="relative group overflow-hidden">
              {/* Green glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600/30 to-emerald-400/30 blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 border border-white/5 shadow-lg group-hover:border-green-500/20 transition-all duration-500">
                <div className="text-lg font-bold text-white">500+</div>
                <div className="text-white/60 text-xs">Happy Vendors</div>
              </div>
            </div>
            
            <div className="relative group overflow-hidden">
              {/* Purple glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-violet-400/30 blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 border border-white/5 shadow-lg group-hover:border-purple-500/20 transition-all duration-500">
                <div className="text-lg font-bold text-white">35%</div>
                <div className="text-white/60 text-xs">Cost Savings</div>
              </div>
            </div>
          </div>

          {/* Additional trust indicators */}
          <div className={`mt-8 text-center transition-all duration-1000 transform ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`} style={{ transitionDelay: '900ms' }}>
            <div className="flex justify-center items-center gap-6 text-white/40 text-sm">
              <span className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Verified Reviews
              </span>
              <span className="flex items-center gap-2">
                <span className="text-blue-400">🛡️</span>
                Trusted Platform
              </span>
              <span className="flex items-center gap-2">
                <span className="text-yellow-400">⚡</span>
                Fast Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;