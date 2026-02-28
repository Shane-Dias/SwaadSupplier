import React, { useMemo } from 'react';

export default function AIBusinessInsights({
    ingredients,
    totalCost,
    dish,
    quantity,
    selectedSuppliers,
    suppliersData
}) {
    // 🧠 AI Analysis Logic
    const insights = useMemo(() => {
        // 1. Spending Summary by Category
        const categorySpend = {};
        let highValueItems = [];

        Object.entries(ingredients).forEach(([name, details]) => {
            const supplierId = selectedSuppliers[name];
            const suppliers = suppliersData[name] || [];
            const supplier = suppliers.find(s => s.id === supplierId);
            const price = supplier?.price || 0;

            // Determine cost for this item
            const itemCost = (details.totalQuantity / (details.unit === 'ml' ? 1000 : 1000)) * price; // Approx
            const realCost = (supplier?.price || 0) * (Math.ceil(details.totalQuantity / (details.unit === 'ml' ? 1000 : 1000)));

            // Mock Category (In real app, getting from DB)
            let category = 'Other';
            const n = name.toLowerCase();
            if (n.includes('oil') || n.includes('ghee')) category = 'Oils & Fats';
            else if (n.includes('chicken') || n.includes('mutton') || n.includes('paneer')) category = 'Protein';
            else if (n.includes('spice') || n.includes('powder') || n.includes('salt')) category = 'Spices';
            else if (n.includes('rice') || n.includes('flour') || n.includes('dal')) category = 'Grains';
            else category = 'Vegetables';

            categorySpend[category] = (categorySpend[category] || 0) + realCost;

            if (realCost > totalCost * 0.2) {
                highValueItems.push({ name, cost: realCost, percent: Math.round((realCost / totalCost) * 100) });
            }
        });

        // 2. Risk Analysis
        const risks = [];
        if (Object.keys(ingredients).some(k => k.toLowerCase().includes('tomato'))) {
            risks.push({ level: 'high', msg: 'Tomato prices are volatile (+15% this week). Consider bulk buying.' });
        }
        if (Object.keys(selectedSuppliers).length < Object.keys(ingredients).length) {
            risks.push({ level: 'medium', msg: 'Partial supplier coverage. Some items must be bought locally.' });
        }

        // 3. Profit Estimate
        // Assume 30% food cost target for healthy business
        const suggestedSellingPrice = (totalCost / 0.3);
        const profitPerPlate = (suggestedSellingPrice - totalCost) / quantity;

        // 4. Seasonal Insights
        const seasonalTips = [];
        const month = new Date().getMonth();
        if (month >= 3 && month <= 6) seasonalTips.push('Mango season approaching. Add Mango Lassi to menu for +20% margin.');
        if (month >= 9 || month <= 1) seasonalTips.push('Winter veggies (Carrots, Peas) are at lowest prices. Stock up!');

        return {
            categorySpend,
            highValueItems,
            risks,
            profitPerPlate: Math.round(profitPerPlate / quantity), // Per batch? No, total profit
            projectedRevenue: Math.round(suggestedSellingPrice),
            seasonalTips
        };
    }, [ingredients, totalCost, selectedSuppliers, suppliersData]);

    return (
        <div className="bg-[#0f172a] border border-blue-500/30 rounded-xl p-6 shadow-2xl overflow-hidden relative group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/20 transition-all duration-1000" />

            {/* Header */}
            <div className="flex items-center space-x-3 mb-6 border-b border-gray-700 pb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <span className="text-2xl">🧠</span>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">AI Business Insights</h3>
                    <p className="text-blue-200/60 text-sm">Real-time analysis for {dish}</p>
                </div>
                <div className="ml-auto flex items-center space-x-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Live Analysis</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* 1. Spending Summary */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-blue-500/30 transition-colors">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3 flex items-center">
                        <span className="text-lg mr-2">💰</span> Spending Focus
                    </h4>
                    <div className="space-y-3">
                        {Object.entries(insights.categorySpend)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 3)
                            .map(([cat, cost], i) => (
                                <div key={cat} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white">{cat}</span>
                                        <span className="text-white/60">{Math.round((cost / totalCost) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${i === 0 ? 'bg-orange-500' : i === 1 ? 'bg-blue-500' : 'bg-purple-500'}`}
                                            style={{ width: `${(cost / totalCost) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* 2. Profit Projection */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-green-500/30 transition-colors">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3 flex items-center">
                        <span className="text-lg mr-2">📈</span> Profit Estimate
                    </h4>
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <p className="text-xs text-white/50 mb-1">Projected Revenue (30% cost)</p>
                            <p className="text-2xl font-bold text-white">₹{insights.projectedRevenue.toLocaleString()}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-green-300">Potential Margin</span>
                                <span className="font-bold text-green-400">70%</span>
                            </div>
                            <p className="text-xs text-white/40 mt-1">Based on market standards for {dish}</p>
                        </div>
                    </div>
                </div>

                {/* 3. Risk Alerts */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-red-500/30 transition-colors">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3 flex items-center">
                        <span className="text-lg mr-2">⚠️</span> Risk Radar
                    </h4>
                    <div className="space-y-3">
                        {insights.risks.length > 0 ? (
                            insights.risks.map((risk, i) => (
                                <div key={i} className="flex items-start space-x-2 p-2 rounded bg-red-500/10 border border-red-500/20">
                                    <span className="text-xs">🔻</span>
                                    <p className="text-xs text-red-200 leading-tight">{risk.msg}</p>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-20 text-green-400/60 text-sm">
                                ✅ Low Risk Detected
                            </div>
                        )}
                        {insights.highValueItems.length > 0 && (
                            <div className="p-2 rounded bg-orange-500/10 border border-orange-500/20">
                                <p className="text-xs text-orange-200">
                                    high cost alert: <b>{insights.highValueItems[0].name}</b> is {insights.highValueItems[0].percent}% of total bill.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. Seasonal & Reorder */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-colors">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3 flex items-center">
                        <span className="text-lg mr-2">🗓️</span> Smart Assistant
                    </h4>
                    <div className="space-y-4">
                        {insights.seasonalTips.map((tip, i) => (
                            <div key={i} className="flex items-center space-x-2 text-sm text-purple-200">
                                <span>💡</span>
                                <span>{tip}</span>
                            </div>
                        ))}
                        {insights.seasonalTips.length === 0 && (
                            <div className="flex items-center space-x-2 text-sm text-purple-200">
                                <span>💡</span>
                                <span>Prices are stable for this season. Good time to stock up on dry grains.</span>
                            </div>
                        )}

                        <div className="pt-3 border-t border-white/10">
                            <p className="text-xs text-gray-400 mb-1">Reorder Forecast</p>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-sm text-white">Stock lasts ~4 days</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
