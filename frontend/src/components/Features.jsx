import React, { useState, useEffect, useRef } from 'react';

const FeatureCard = ({ glowColor, icon, title, description }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const activeGlowColor = glowColor;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`glass-card rounded-xl p-6 transition-all duration-800 transform relative overflow-hidden ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered 
          ? `0 0 25px 2px ${activeGlowColor}, 0 0 10px 0 ${activeGlowColor} inset` 
          : `0 0 5px 0 ${activeGlowColor}`
      }}
    >
      {/* Subtle glow effect in the background */}
      <div
        className="absolute -inset-1 rounded-xl opacity-30 blur-xl transition-opacity duration-500"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${activeGlowColor} 0%, transparent 70%)`,
          opacity: isHovered ? 0.5 : 0.2
        }}
      />
      
      {/* Content with relative positioning to stay above the glow effect */}
      <div className="relative z-10">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300"
          style={{ 
            backgroundColor: isHovered ? `${activeGlowColor}40` : 'rgba(249, 115, 22, 0.2)',
            boxShadow: isHovered ? `0 0 10px 0 ${activeGlowColor}` : 'none'
          }}
        >
          {icon}
        </div>
        <h3 className="text-xl font-medium text-white mb-2 transition-colors duration-300">{title}</h3>
        <p className="text-white/60 transition-colors duration-300">{description}</p>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/8 to-transparent" />
      <div className="absolute -left-10 top-20 w-64 h-64 bg-orange-500/10 blur-3xl" />
      <div className="absolute right-0 bottom-10 w-72 h-72 bg-red-500/10 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-14">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-orange-300 uppercase tracking-[0.2em]">Why vendors stay</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-3">Operational wins in one place</h2>
          <p className="text-white/65 max-w-3xl mx-auto">Reliable supply, predictable costs, and tools that keep both vendors and suppliers in sync.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            glowColor="rgba(249, 115, 22, 0.5)" // Orange glow
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Verified Suppliers"
            description="Connect with background-checked, reliable suppliers who understand street food vendor needs."
          />
          
          <FeatureCard
            glowColor="rgba(16, 185, 129, 0.5)" // Green glow
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Best Prices"
            description="Compare live quotes and unlock bulk savings without phone calls or haggling."
          />
          
          <FeatureCard
            glowColor="rgba(59, 130, 246, 0.5)" // Blue glow
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Quality Assurance"
            description="Freshness, hygiene, and certificates surfaced up front to cut uncertainty."
          />
          
          <FeatureCard
            glowColor="rgba(168, 85, 247, 0.5)" // Purple glow
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 12l-4-4m4 4l4-4m-4 4V9" />
              </svg>
            }
            title="Group Ordering"
            description="Coordinate bulk orders with nearby vendors to share delivery costs and improve margins."
          />
          
          <FeatureCard
            glowColor="rgba(234, 88, 12, 0.5)" // Amber glow
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Fast Delivery"
            description="Service-level awareness and proactive alerts keep perishables moving on time."
          />
          
          <FeatureCard
            glowColor="rgba(6, 182, 212, 0.5)" // Cyan glow
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            title="Inventory Management"
            description="Reorder nudges, low-stock highlights, and simple stock edits without leaving the flow."
          />
        </div>
        <div className="mt-10 text-center text-sm text-white/50">Built for busy hours: minimal clicks, clear status, fewer surprises.</div>
      </div>
    </section>
  );
};

export default FeaturesSection;