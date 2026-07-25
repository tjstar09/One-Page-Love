import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BentoLanding({ design }) {
  const [activeTab, setActiveTab] = useState('features');
  const [counterAnimations, setCounterAnimations] = useState({});
  const [flippedCards, setFlippedCards] = useState({});
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counterAnimations[entry.target.dataset.counter]) {
          const target = parseInt(entry.target.dataset.target);
          animateCounter(entry.target, target);
          setCounterAnimations(prev => ({ ...prev, [entry.target.dataset.counter]: true }));
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-counter]').forEach(el => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, [counterAnimations]);

  const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }
    }, 30);
  };

  const flipCard = (index) => {
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const tabs = [
    { id: 'features', label: 'Features', icon: '✨' },
    { id: 'metrics', label: 'Metrics', icon: '📊' },
    { id: 'testimonials', label: 'Testimonials', icon: '💬' },
  ];

  const features = [
    { title: 'Smart Analytics', desc: 'Real-time insights with AI-powered predictions', icon: '📈' },
    { title: 'Team Collaboration', desc: 'Seamless workflow for distributed teams', icon: '👥' },
    { title: 'Custom Workflows', desc: 'Build processes that match your unique needs', icon: '⚙️' },
    { title: 'Enterprise Security', desc: 'SOC2 compliant with advanced access controls', icon: '🔒' },
    { title: 'API Integration', desc: 'Connect with 100+ tools you already use', icon: '🔗' },
    { title: 'Mobile First', desc: 'Full functionality on any device, anywhere', icon: '📱' },
  ];

  const metrics = [
    { label: 'Active Users', value: 24500, suffix: '+' },
    { label: 'Tasks Completed', value: 1200000, suffix: '+' },
    { label: 'Teams Onboarded', value: 8500, suffix: '+' },
    { label: 'Uptime Guarantee', value: 99.9, suffix: '%' },
  ];

  const testimonials = [
    { name: 'Sarah Chen', role: 'VP Engineering', company: 'TechCorp', content: 'Bento transformed how our team collaborates. The modular approach lets us customize everything.', avatar: 'SC' },
    { name: 'Marcus Johnson', role: 'Product Lead', company: 'StartupXYZ', content: 'Finally a dashboard that adapts to us, not the other way around. Game changer.', avatar: 'MJ' },
    { name: 'Emily Rodriguez', role: 'Operations', company: 'ScaleUp Inc', content: 'The metrics visibility alone saved us 20 hours a week. Worth every penny.', avatar: 'ER' },
  ];

  return (
    <div className="w-full h-full" style={{ 
      backgroundColor: design.colors.background,
      color: design.colors.text,
      fontFamily: design.fonts.body,
    }}>
      {/* Hero Section */}
      <section className="relative px-6 py-16">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-peach-300/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-peach-300/20 blur-3xl" />
        </div>

        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ backgroundColor: design.colors.primary + '33', color: design.colors.primary }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span>🎯</span> Bento Grid Dashboard
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: design.fonts.heading, color: design.colors.text }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Modular dashboard that{' '}
            <span style={{ color: design.colors.primary }}>adapts to you</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Drag, resize, and rearrange cards to build your perfect workspace. Every metric, chart, and tool exactly where you need it.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              className="px-8 py-4 rounded-xl font-semibold text-lg"
              style={{ backgroundColor: design.colors.primary, color: 'white', fontFamily: design.fonts.body }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Try Live Demo
            </motion.button>
            <motion.button
              className="px-8 py-4 rounded-xl font-semibold text-lg border-2"
              style={{ borderColor: design.colors.primary, color: design.colors.primary, fontFamily: design.fonts.body }}
              whileHover={{ backgroundColor: design.colors.primary + '10' }}
              whileTap={{ scale: 0.98 }}
            >
              View Documentation
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Bento Grid Demo */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Filter Tabs */}
          <motion.div
            className="flex gap-3 mb-10 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {tabs.map((tab, i) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all"
                style={{
                  backgroundColor: activeTab === tab.id ? design.colors.primary : 'white',
                  color: activeTab === tab.id ? 'white' : design.colors.text,
                  border: `1px solid ${activeTab === tab.id ? design.colors.primary : design.colors.primary + '33'}`,
                  fontFamily: design.fonts.body,
                  boxShadow: activeTab === tab.id ? `0 4px 14px ${design.colors.primary}44` : '0 2px 8px rgba(0,0,0,0.05)',
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Bento Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6"
            style={{ gridAutoRows: 'minmax(180px, auto)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {activeTab === 'features' && (
              <>
                {/* Large Feature Card */}
                <motion.div
                  className="lg:col-span-6 lg:row-span-2 p-8 relative overflow-hidden rounded-2xl"
                  style={{ backgroundColor: 'white', border: `1px solid ${design.colors.primary}22` }}
                  whileHover={{ y: -4, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
                >
                  <div className="absolute inset-0 opacity-5" aria-hidden="true">
                    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ color: design.colors.primary }}>
                      <defs>
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <span className="text-5xl mb-4 block">🎯</span>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>
                      Smart Analytics Dashboard
                    </h3>
                    <p className="text-gray-600 mb-6" style={{ fontFamily: design.fonts.body }}>
                      Real-time insights with AI-powered predictions. Track KPIs, monitor trends, and make data-driven decisions with confidence.
                    </p>
                    <motion.button
                      className="px-5 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                      style={{ backgroundColor: design.colors.primary + '15', color: design.colors.primary, fontFamily: design.fonts.body }}
                      whileHover={{ scale: 1.02, backgroundColor: design.colors.primary + '25' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Explore Features →
                    </motion.button>
                  </div>
                </motion.div>

                {/* Medium Cards */}
                {features.slice(0, 2).map((feature, i) => (
                  <motion.div
                    key={i}
                    className="lg:col-span-3 p-6 relative overflow-hidden rounded-2xl cursor-pointer"
                    style={{ backgroundColor: 'white', border: `1px solid ${design.colors.primary}22` }}
                    whileHover={{ y: -4, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
                    onClick={() => flipCard(i)}
                  >
                    <div className="absolute inset-0 opacity-5" aria-hidden="true">
                      <svg viewBox="0 0 100 100" className="w-full h-full" style={{ color: design.colors.primary }}>
                        <defs>
                          <pattern id="dots" width="15" height="15" patternUnits="userSpaceOnUse">
                            <circle cx="7.5" cy="7.5" r="1" fill="currentColor" />
                          </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#dots)" />
                      </svg>
                    </div>
                    <div className="relative z-10">
                      <span className="text-4xl mb-3 block">{feature.icon}</span>
                      <h4 className="font-semibold text-lg mb-2" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 text-sm" style={{ fontFamily: design.fonts.body }}>{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}

                {/* Metrics Cards Row */}
                {metrics.slice(0, 2).map((metric, i) => (
                  <motion.div
                    key={`metric-${i}`}
                    className="lg:col-span-3 p-6 rounded-2xl text-center"
                    style={{ backgroundColor: 'white', border: `1px solid ${design.colors.primary}22` }}
                  >
                    <div className="text-4xl mb-2">{i === 0 ? '👥' : '✅'}</div>
                    <div 
                      className="text-4xl font-bold mb-1"
                      style={{ color: design.colors.primary, fontFamily: design.fonts.heading }}
                      data-counter={`metric-${i}`}
                      data-target={metric.value}
                    >
                      0
                    </div>
                    <div className="text-sm text-gray-600" style={{ fontFamily: design.fonts.body }}>
                      {metric.label} {metric.suffix}
                    </div>
                  </motion.div>
                ))}
              </>
            )}

            {activeTab === 'metrics' && (
              <>
                {metrics.map((metric, i) => (
                  <motion.div
                    key={i}
                    className="lg:col-span-3 p-8 rounded-2xl text-center relative overflow-hidden"
                    style={{ backgroundColor: 'white', border: `1px solid ${design.colors.primary}22` }}
                    whileHover={{ y: -4, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
                  >
                    <div className="absolute inset-0 opacity-5" aria-hidden="true">
                      <svg viewBox="0 0 100 100" className="w-full h-full" style={{ color: design.colors.primary }}>
                        <defs>
                          <pattern id="lines" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 0 10 L 10 0" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                          </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#lines)" />
                      </svg>
                    </div>
                    <div className="relative z-10">
                      <div className="text-5xl mb-3">{['👥', '✅', '👨‍💻', '⏱️'][i]}</div>
                      <div 
                        className="text-5xl font-bold mb-2"
                        style={{ color: design.colors.primary, fontFamily: design.fonts.heading }}
                        data-counter={`metric-main-${i}`}
                        data-target={metric.value}
                      >
                        0
                      </div>
                      <div className="text-lg font-medium" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>
                        {metric.label}
                      </div>
                      <div className="text-sm text-gray-500 mt-1" style={{ fontFamily: design.fonts.body }}>
                        {metric.suffix === '%' ? 'Guaranteed uptime SLA' : 'Growing monthly'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </>
            )}

            {activeTab === 'testimonials' && (
              <>
                {testimonials.map((testimonial, i) => (
                  <motion.div
                    key={i}
                    className="lg:col-span-4 p-8 rounded-2xl relative overflow-hidden"
                    style={{ backgroundColor: 'white', border: `1px solid ${design.colors.primary}22` }}
                    whileHover={{ y: -4, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
                  >
                    <div className="absolute inset-0 opacity-3" aria-hidden="true">
                      <svg viewBox="0 0 100 100" className="w-full h-full" style={{ color: design.colors.primary }}>
                        <text x="50" y="50" fontSize="80" textAnchor="middle" dominantBaseline="middle" opacity="0.1">"</text>
                      </svg>
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: design.colors.primary }}>
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>{testimonial.name}</p>
                          <p className="text-sm text-gray-500" style={{ fontFamily: design.fonts.body }}>{testimonial.role}, {testimonial.company}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-4" style={{ fontFamily: design.fonts.body }}>
                        "{testimonial.content}"
                      </p>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(star => (
                          <motion.span key={star} className="text-yellow-400" whileHover={{ scale: 1.2 }}>★</motion.span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="px-6 py-16 border-t" style={{ borderColor: design.colors.primary + '22' }}>
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-10"
            style={{ color: design.colors.text, fontFamily: design.fonts.heading }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Try the Interactive Grid
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 rounded-2xl"
            style={{ backgroundColor: 'white', border: `2px dashed ${design.colors.primary}44` }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {[
              { title: 'Drag to Reorder', icon: '🖱️', size: 'lg:col-span-2 lg:row-span-2' },
              { title: 'Resize Handles', icon: '📏', size: 'lg:col-span-1' },
              { title: 'Add Widgets', icon: '➕', size: 'lg:col-span-1' },
              { title: 'Save Layouts', icon: '💾', size: 'lg:col-span-1' },
              { title: 'Dark Mode', icon: '🌙', size: 'lg:col-span-1' },
            ].map((demo, i) => (
              <motion.div
                key={i}
                className={`p-6 rounded-xl text-center cursor-move transition-all ${demo.size}`}
                style={{ 
                  backgroundColor: design.colors.background,
                  border: `1px solid ${design.colors.primary}33`,
                  fontFamily: design.fonts.body,
                }}
                whileHover={{ 
                  y: -4, 
                  scale: 1.02,
                  boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)',
                  borderColor: design.colors.primary,
                }}
                whileTap={{ scale: 0.98 }}
                drag
                dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
              >
                <span className="text-4xl mb-3 block">{demo.icon}</span>
                <h4 className="font-semibold" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>
                  {demo.title}
                </h4>
                <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: design.fonts.body }}>
                  Click and drag to try
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}