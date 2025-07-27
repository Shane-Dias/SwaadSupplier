import React, { useState, useEffect, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const StreetFoodLandingPage = () => {
  const [isVisible, setIsVisible] = useState({
    badge: false,
    heading1: false,
    heading2: false,
    subtitle: false,
    buttons: false,
  });

  const [init, setInit] = useState(false);

  // Initialize tsParticles engine
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Staggered animations for content
  useEffect(() => {
    // Staggered animations
    const timers = [
      setTimeout(() => setIsVisible((prev) => ({ ...prev, badge: true })), 300),
      setTimeout(
        () => setIsVisible((prev) => ({ ...prev, heading1: true })),
        800
      ),
      setTimeout(
        () => setIsVisible((prev) => ({ ...prev, heading2: true })),
        1300
      ),
      setTimeout(
        () => setIsVisible((prev) => ({ ...prev, subtitle: true })),
        1800
      ),
      setTimeout(
        () => setIsVisible((prev) => ({ ...prev, buttons: true })),
        2300
      ),
    ];

    // Cleanup
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  // Particles configuration for floating food elements/steam
  const particlesOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60,
      particles: {
        color: {
          value: ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffffff"],
        },
        move: {
          enable: true,
          direction: "top",
          outModes: {
            default: "out",
          },
          random: true,
          speed: 0.3,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 1000,
          },
          value: 150,
        },
        opacity: {
          value: { min: 0.2, max: 0.8 },
          animation: {
            enable: true,
            speed: 0.8,
            minimumValue: 0.1,
            sync: false,
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 4 },
          animation: {
            enable: true,
            speed: 1.5,
            minimumValue: 0.3,
            sync: false,
          },
        },
        twinkle: {
          lines: {
            enable: true,
            frequency: 0.005,
            color: {
              value: "#f97316",
            },
            opacity: 0.6,
          },
          particles: {
            enable: true,
            frequency: 0.03,
            color: {
              value: "#fb923c",
            },
            opacity: 0.3,
          },
        },
      },
      detectRetina: true,
    }),
    []
  );

  const fadeClass = (element) =>
    `transition-all duration-1000 transform ${
      isVisible[element]
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-10"
    }`;

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-900 relative">
      {/* Particles.js floating elements background */}
      {init && (
        <Particles className="absolute inset-0" options={particlesOptions} />
      )}

      {/* Gradient backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-red-500/10" />

      {/* Simple decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-orange-500/8 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-red-500/8 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-yellow-500/5 blur-3xl" />

      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-orange-500/20 mb-8 ${fadeClass(
              "badge"
            )}`}
          >
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-sm text-orange-200/80 tracking-wide font-medium">
              🍜 Street Food Solutions
            </span>
          </div>

          {/* Main heading */}
          <div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-2 tracking-tight">
              <span
                className={`block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80 ${fadeClass(
                  "heading1"
                )}`}
              >
                Connect. Source.
              </span>
              <span
                className={`block bg-clip-text text-transparent bg-gradient-to-r from-orange-300 via-yellow-200 to-red-300 ${fadeClass(
                  "heading2"
                )}`}
              >
                Grow Together
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p
            className={`text-base sm:text-lg md:text-xl text-white/60 mb-10 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-4 ${fadeClass(
              "subtitle"
            )}`}
          >
            The ultimate platform connecting street food vendors with trusted suppliers. 
            Get quality ingredients at the best prices, delivered fast to keep your business thriving.
          </p>

          {/* Call to action buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center ${fadeClass(
              "buttons"
            )}`}
          >
            <a href="/signup">
              <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Join as Vendor
              </button>
            </a>
            <a href="/signup">
              <button className="px-8 py-4 rounded-lg bg-transparent border-2 border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500/50 text-orange-200 font-semibold transition-all duration-300">
                Become Supplier
              </button>
            </a>
          </div>

          {/* Quick stats or features preview */}
          <div
            className={`mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto ${fadeClass(
              "buttons"
            )}`}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">500+</div>
              <div className="text-sm text-white/50">Active Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">50+</div>
              <div className="text-sm text-white/50">Trusted Suppliers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">₹2L+</div>
              <div className="text-sm text-white/50">Savings Generated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900/60 pointer-events-none" />
    </div>
  );
};

export default StreetFoodLandingPage;