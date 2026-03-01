import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const savingsData = [
  { month: 'Jan', traditional: 100, streetSource: 75 },
  { month: 'Feb', traditional: 105, streetSource: 72 },
  { month: 'Mar', traditional: 110, streetSource: 78 },
  { month: 'Apr', traditional: 108, streetSource: 70 },
  { month: 'May', traditional: 115, streetSource: 68 },
  { month: 'Jun', traditional: 120, streetSource: 65 },
  { month: 'Jul', traditional: 118, streetSource: 62 },
];

// Growth metrics data
const growthData = [
  { metric: 'Vendors', count: 500, growth: '+45%' },
  { metric: 'Suppliers', count: 85, growth: '+30%' },
  { metric: 'Orders', count: 2400, growth: '+65%' },
  { metric: 'Savings', count: 200000, growth: '+80%' },
];

const SavingsChart = () => {
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Cost comparison (₹/kg)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={savingsData}>
          <XAxis dataKey="month" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip 
            wrapperClassName="bg-gray-900 p-2 rounded-lg text-white" 
            formatter={(value, name) => [
              `₹${value}/kg`,
              name === 'streetSource' ? 'StreetSource' : 'Traditional Sourcing'
            ]}
          />
          <Bar dataKey="streetSource" fill="#f97316" radius={[5, 5, 0, 0]} />
          <Bar dataKey="traditional" fill="#ef4444" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-center mt-4 gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-sm text-white/80">StreetSource</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm text-white/80">Traditional Sourcing</span>
        </div>
      </div>
    </div>
  );
};

const GrowthMetrics = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {growthData.map((item, index) => (
        <motion.div
          key={item.metric}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="glass-card border border-orange-500/15 rounded-lg p-4 text-center hover:border-orange-500/40 transition-colors duration-300"
        >
          <div className="text-2xl font-bold text-orange-400 mb-1">
            {item.metric === 'Savings' ? `₹${(item.count / 1000).toFixed(0)}K` : item.count}
          </div>
          <div className="text-sm text-white/80 mb-2">{item.metric}</div>
          <div className="text-xs text-green-400 font-medium">{item.growth}</div>
        </motion.div>
      ))}
    </div>
  );
};

const PerformanceSection = () => {
  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/7 to-red-500/7" />
      <div className="absolute top-10 right-10 w-56 h-56 bg-orange-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 blur-3xl" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Proven Cost Savings & Growth</h2>
          <p className="text-white/65 max-w-3xl mx-auto">Predictable supply, measurable savings, and happier vendors and suppliers—backed by live data, not claims.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <SavingsChart />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <h3 className="text-2xl font-medium text-white mb-6">Platform Growth</h3>
            <GrowthMetrics />
            
            <div className="mt-8 space-y-6">
              {[
                {
                  title: 'Cost Reduction',
                  description: 'Average 35% savings on raw material costs through our verified supplier network.',
                  icon: '💰'
                },
                {
                  title: 'Quality Assurance',
                  description: 'All suppliers are verified for freshness, hygiene standards, and reliable delivery.',
                  icon: '✅'
                },
                {
                  title: 'Community Growth',
                  description: 'Growing network of vendors sharing resources and bulk-buying opportunities.',
                  icon: '🤝'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">{item.title}</h4>
                    <p className="text-white/60">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Additional Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass-card border border-orange-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Platform Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">₹2L+</div>
                <div className="text-white/80">Total Savings Generated</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">1000+</div>
                <div className="text-white/80">Successful Orders</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-2">95%</div>
                <div className="text-white/80">Vendor Satisfaction</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PerformanceSection;