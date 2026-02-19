import React, { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Truck, Package, MapPin, Navigation } from "lucide-react";
import "leaflet-routing-machine";

// Fix Leaflet marker icons
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom component for Routing Machine
const RoutingMachine = ({ origin, destination }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        // The routing machine needs L.Routing to be available
        if (!L.Routing) {
            console.error("Leaflet Routing Machine not loaded");
            return;
        }

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(origin[0], origin[1]),
                L.latLng(destination[0], destination[1]),
            ],
            lineOptions: {
                styles: [{ color: "#ea580c", weight: 6, opacity: 0.8 }], // Orange line
            },
            createMarker: () => null,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            show: false,
        }).addTo(map);

        return () => {
            if (map && routingControl) {
                try {
                    map.removeControl(routingControl);
                } catch (e) {
                    console.error("Error removing routing control:", e);
                }
            }
        };
    }, [map, origin, destination]);

    return null;
};

const OrderTracking = ({ order: initialOrder }) => {
    const [order, setOrder] = useState(initialOrder);
    const [currentStatus, setCurrentStatus] = useState(initialOrder.status);
    const [coordinates] = useState({
        supplier: [19.076, 72.8777], // Mumbai
        vendor: [18.5204, 73.8567], // Pune
    });

    // Polling Logic - 5 seconds
    useEffect(() => {
        const fetchOrderStatus = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/vendor`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (response.ok) {
                    const orders = await response.json();
                    const updatedOrder = orders.find(o => o._id === initialOrder._id);
                    if (updatedOrder && updatedOrder.status !== currentStatus) {
                        setCurrentStatus(updatedOrder.status);
                        setOrder(updatedOrder);
                    }
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        };

        const interval = setInterval(fetchOrderStatus, 5000);
        return () => clearInterval(interval);
    }, [initialOrder._id, currentStatus]);

    const steps = [
        { status: "pending", label: "Ordered", icon: Clock },
        { status: "packed", label: "Packed", icon: Package },
        { status: "shipped", label: "Shipped", icon: Truck },
        { status: "out_for_delivery", label: "Out Delivery", icon: Navigation },
        { status: "delivered", label: "Delivered", icon: CheckCircle },
    ];

    const currentStepIndex = steps.findIndex((s) => s.status === currentStatus);
    const isMapVisible = currentStepIndex >= 2 && currentStatus !== "delivered"; // Shipped or Out For Delivery
    const isDelivered = currentStatus === "delivered";

    return (
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
            {/* 1. Status Timeline */}
            <div className="p-8 bg-gray-900/80 border-b border-gray-700">
                <div className="flex items-center justify-between relative px-2">
                    {/* Progress Bar Background */}
                    <div className="absolute left-10 right-10 top-1/2 transform -translate-y-6 w-[80%] h-1 bg-gray-700 z-0"></div>

                    {/* Active Progress Bar */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{
                            width: `${(currentStepIndex / (steps.length - 1)) * 80}%`,
                        }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="absolute left-10 top-1/2 transform -translate-y-6 h-1 bg-gradient-to-r from-orange-500 to-green-500 z-0"
                    ></motion.div>

                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const completed = index <= currentStepIndex;
                        const active = index === currentStepIndex;

                        return (
                            <div
                                key={step.status}
                                className="relative z-10 flex flex-col items-center flex-1"
                            >
                                <motion.div
                                    animate={active ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${completed
                                        ? "bg-green-500 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                                        : "bg-gray-800 border-gray-700 text-gray-500"
                                        } ${active ? "ring-4 ring-green-500/30 scale-110" : ""}`}
                                >
                                    <Icon size={20} />
                                </motion.div>
                                <span
                                    className={`text-[10px] md:text-xs mt-3 font-bold uppercase tracking-wider ${completed ? "text-green-400" : "text-gray-500"
                                        } ${active ? "animate-pulse" : ""}`}
                                >
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 2. Map Section */}
            <div className="relative h-80 w-full bg-gray-900 group">
                <AnimatePresence mode="wait">
                    {isDelivered ? (
                        <motion.div
                            key="delivered"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-md"
                        >
                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                                <CheckCircle size={48} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-2">Order Delivered Successfully!</h2>
                            <p className="text-gray-400">Your fresh ingredients have arrived.</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-8 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full border border-gray-700 transition-colors"
                            >
                                Close Tracking
                            </button>
                        </motion.div>
                    ) : isMapVisible ? (
                        <motion.div
                            key="map"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full w-full"
                        >
                            <MapContainer
                                center={[18.8, 73.3]}
                                zoom={8}
                                scrollWheelZoom={false}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                <RoutingMachine
                                    origin={coordinates.supplier}
                                    destination={coordinates.vendor}
                                />

                                <Marker position={coordinates.supplier}>
                                    <Popup className="custom-popup">
                                        <div className="p-1">
                                            <p className="font-bold text-orange-600">Supplier</p>
                                            <p className="text-xs">{order?.supplier?.shopName}</p>
                                        </div>
                                    </Popup>
                                </Marker>

                                <Marker position={coordinates.vendor}>
                                    <Popup>
                                        <div className="p-1">
                                            <p className="font-bold text-blue-600">Your Location</p>
                                            <p className="text-xs">Incoming Delivery</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            </MapContainer>

                            {/* Info Overlays */}
                            <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
                                <div className="bg-gray-900/90 backdrop-blur-md px-4 py-3 rounded-xl border border-gray-700 shadow-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-500/20 rounded-lg">
                                            <Truck size={18} className="text-orange-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-black">Distance</p>
                                            <p className="text-sm font-bold text-white">~148 km</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-900/90 backdrop-blur-md px-4 py-3 rounded-xl border border-gray-700 shadow-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/20 rounded-lg">
                                            <Clock size={18} className="text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-black">Estimated Time</p>
                                            <p className="text-sm font-bold text-white">2h 45m</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="preparing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full w-full flex flex-col items-center justify-center bg-gray-900/50"
                        >
                            <div className="relative">
                                <Package size={64} className="text-gray-700 mb-4 animate-bounce" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-ping"></div>
                            </div>
                            <p className="text-gray-400 font-medium">Preparing for Shipment...</p>
                            <p className="text-xs text-gray-600 mt-2">Map will become visible once the order is shipped.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 3. Footer Details */}
            <div className="p-6 bg-gray-900/40 border-t border-gray-700 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700">
                        <MapPin className="text-orange-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Pickup From</p>
                        <p className="text-sm text-white font-medium">{order?.supplier?.shopName || "Supplier Hub"}</p>
                    </div>
                </div>
                <div className="px-4 py-2 bg-orange-500/10 rounded-full border border-orange-500/20">
                    <p className="text-xs text-orange-400 font-bold">LIVE UPDATE ENABLED (5s)</p>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
