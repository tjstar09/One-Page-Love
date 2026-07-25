import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CafeLanding({ design }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle'); // idle, loading, success, error
  const [scrollRevealed, setScrollRevealed] = useState(new Set());
  const observerRef = useRef(null);

  const menuCategories = ['all', 'coffee', 'pastries', 'breakfast', 'lunch', 'drinks'];
  
  const menuItems = [
    { id: 1, name: 'Signature Espresso', desc: 'Rich, bold single-origin beans', price: '$4.50', category: 'coffee', image: '☕' },
    { id: 2, name: 'Caramel Latte', desc: 'Smooth espresso with house-made caramel', price: '$5.50', category: 'coffee', image: '🥛' },
    { id: 3, name: 'Cold Brew', desc: 'Steeped 18 hours for smooth flavor', price: '$5.00', category: 'coffee', image: '🧊' },
    { id: 4, name: 'Almond Croissant', desc: 'Buttery, flaky, filled with almond cream', price: '$4.00', category: 'pastries', image: '🥐' },
    { id: 5, name: 'Cinnamon Roll', desc: 'Warm, gooey, cream cheese frosting', price: '$4.50', category: 'pastries', image: '🍩' },
    { id: 6, name: 'Blueberry Scone', desc: 'Fresh berries, lemon glaze', price: '$3.50', category: 'pastries', image: '🫐' },
    { id: 7, name: 'Avocado Toast', desc: 'Sourdough, smashed avo, poached egg, chili flakes', price: '$12.00', category: 'breakfast', image: '🥑' },
    { id: 8, name: 'Acai Bowl', desc: 'Organic acai, granola, fresh fruit, honey', price: '$11.00', category: 'breakfast', image: '🍓' },
    { id: 9, name: 'Grilled Cheese & Tomato Soup', desc: 'Aged cheddar, sourdough, roasted tomato bisque', price: '$13.00', category: 'lunch', image: '🍅' },
    { id: 10, name: 'Quinoa Salad Bowl', desc: 'Mixed greens, roasted veggies, tahini dressing', price: '$14.00', category: 'lunch', image: '🥗' },
    { id: 11, name: 'Matcha Latte', desc: 'Ceremonial grade matcha, oat milk', price: '$5.50', category: 'drinks', image: '🍵' },
    { id: 12, name: 'Fresh Pressed Juice', desc: 'Daily rotating seasonal blend', price: '$6.00', category: 'drinks', image: '🧃' },
  ];

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  // Scroll reveal observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setScrollRevealed(prev => new Set([...prev, entry.target.dataset.reveal]));
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || newsletterStatus === 'loading') return;
    
    setNewsletterStatus('loading');
    await new Promise(r => setTimeout(r, 1500));
    
    // Simulate random success/failure for demo
    if (Math.random() > 0.2) {
      setNewsletterStatus('success');
      setNewsletterEmail('');
    } else {
      setNewsletterStatus('error');
    }
    
    setTimeout(() => setNewsletterStatus('idle'), 3000);
  };

  const openLightbox = (item) => {
    setLightboxImage(item);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  return (
    <div className="w-full h-full" style={{ 
      backgroundColor: design.colors.background,
      color: design.colors.text,
      fontFamily: design.fonts.body,
    }}>
      {/* Steam Animation Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {[1,2,3,4,5].map(i => (
          <motion.div
            key={i}
            className="absolute bottom-full left-1/4 w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: design.colors.primary + '33',
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 0.5}s`,
            }}
            animate={{ 
              y: [-100, -window.innerHeight - 100],
              opacity: [0, 0.3, 0],
              scale: [0.5, 1, 1.5]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: 'easeOut',
              delay: i * 0.8
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center px-6 py-20">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full" style={{ backgroundColor: design.colors.primary + '10', filter: 'blur(80px)' }} />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full" style={{ backgroundColor: design.colors.accent + '10', filter: 'blur(80px)' }} />
        </div>

        <motion.div
          className="relative max-w-4xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ backgroundColor: design.colors.primary + '20', color: design.colors.primary }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span>☕</span> Est. 2024 • Artisan Coffee Roasters
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: design.fonts.heading, color: design.colors.text }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Where every cup tells a{' '}
            <span style={{ color: design.colors.primary }}>story</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Nestled in the heart of the city, we serve ethically sourced coffee 
            alongside freshly baked pastries in a space designed for connection, 
            creativity, and comfort.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              className="px-8 py-4 rounded-xl font-semibold text-lg"
              style={{ backgroundColor: design.colors.primary, color: 'white', fontFamily: design.fonts.body }}
              whileHover={{ scale: 1.02, boxShadow: `0 10px 30px -5px ${design.colors.primary}CC` }}
              whileTap={{ scale: 0.98 }}
            >
              View Our Menu
            </motion.button>
            <motion.button
              className="px-8 py-4 rounded-xl font-semibold text-lg border-2"
              style={{ borderColor: design.colors.primary, color: design.colors.primary, fontFamily: design.fonts.body }}
              whileHover={{ backgroundColor: design.colors.primary + '10' }}
              whileTap={{ scale: 0.98 }}
            >
              Find a Location
            </motion.button>
          </motion.div>

          {/* Steam animation on hero */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {[1,2,3].map(i => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: design.colors.primary + '88' }}
                animate={{ 
                  y: [0, -30, -60],
                  opacity: [0.6, 0.3, 0],
                  scale: [0.5, 1, 1.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: 'easeOut',
                  delay: i * 0.3
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Menu Section with Category Tabs */}
      <section className="px-6 py-16" data-reveal="menu">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-medium uppercase tracking-wide mb-2 block" style={{ color: design.colors.primary }}>
              Our Offerings
            </span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>
              Crafted with Care
            </h2>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto" style={{ fontFamily: design.fonts.body }}>
              Every item is made fresh daily using locally sourced ingredients
            </p>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            className="flex flex-wrap gap-3 justify-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {menuCategories.map((cat, i) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-5 py-2.5 rounded-full font-medium text-sm transition-all"
                style={{
                  backgroundColor: activeCategory === cat ? design.colors.primary : 'white',
                  color: activeCategory === cat ? 'white' : design.colors.text,
                  border: `1px solid ${activeCategory === cat ? design.colors.primary : design.colors.primary + '33'}`,
                  fontFamily: design.fonts.body,
                  boxShadow: activeCategory === cat ? `0 4px 14px ${design.colors.primary}44` : '0 2px 8px rgba(0,0,0,0.05)',
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </motion.button>
            ))}
          </motion.div>

          {/* Menu Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {filteredItems.map((item, index) => (
              <motion.article
                key={item.id}
                className="group relative overflow-hidden rounded-2xl"
                style={{ backgroundColor: 'white', border: `1px solid ${design.colors.primary}22` }}
                whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="aspect-square relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-8xl" style={{ backgroundColor: design.colors.background }}>
                    {item.image}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.button
                    onClick={() => openLightbox(item)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 opacity-0 group-hover:opacity-100 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`View ${item.name} details`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </motion.button>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>
                      {item.name}
                    </h3>
                    <span className="font-bold text-lg" style={{ color: design.colors.primary, fontFamily: design.fonts.heading }}>
                      {item.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2" style={{ fontFamily: design.fonts.body }}>
                    {item.desc}
                  </p>
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                    style={{ 
                      backgroundColor: design.colors.primary + '15', 
                      color: design.colors.primary,
                      fontFamily: design.fonts.body 
                    }}
                  >
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Location & Map Section */}
      <section className="px-6 py-16 border-t" style={{ borderColor: design.colors.primary + '22' }} data-reveal="location">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <span className="text-sm font-medium uppercase tracking-wide mb-2 block" style={{ color: design.colors.primary }}>
                Visit Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>
                Find Your Corner
              </h2>
              <p className="text-gray-600 mb-6" style={{ fontFamily: design.fonts.body }}>
                Three locations across the city, each with its own character but the same warm welcome.
              </p>
              
              <div className="space-y-4">
                {[
                  { name: 'Downtown Flagship', addr: '123 Main Street', hours: 'Mon-Fri 6am-8pm • Sat-Sun 7am-9pm', icon: '🏙️' },
                  { name: 'Arts District', addr: '456 Gallery Lane', hours: 'Mon-Sun 7am-10pm', icon: '🎨' },
                  { name: 'Riverside', addr: '789 Waterfront Blvd', hours: 'Mon-Sun 6am-9pm', icon: '🌊' },
                ].map((loc, i) => (
                  <motion.div
                    key={i}
                    className="p-5 rounded-xl flex items-start gap-4"
                    style={{ backgroundColor: 'white', border: `1px solid ${design.colors.primary}22` }}
                    whileHover={{ x: 4 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="text-3xl">{loc.icon}</span>
                    <div>
                      <h4 className="font-semibold" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>{loc.name}</h4>
                      <p className="text-sm text-gray-600" style={{ fontFamily: design.fonts.body }}>{loc.addr}</p>
                      <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: design.fonts.body }}>{loc.hours}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="relative aspect-video rounded-2xl overflow-hidden" style={{ backgroundColor: design.colors.background, border: `1px solid ${design.colors.primary}22` }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>Interactive Map</h3>
                  <p className="text-gray-600 mb-4" style={{ fontFamily: design.fonts.body }}>Click pins to explore each location</p>
                  <motion.button
                    className="px-6 py-3 rounded-xl font-medium"
                    style={{ backgroundColor: design.colors.primary, color: 'white', fontFamily: design.fonts.body }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Open Full Map
                  </motion.button>
                </div>
              </div>
              
              {/* Map pins */}
              <motion.div 
                className="absolute top-1/3 left-1/3 p-2 rounded-full cursor-pointer"
                style={{ backgroundColor: design.colors.primary }}
                whileHover={{ scale: 1.3 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              </motion.div>
              <motion.div 
                className="absolute top-1/2 right-1/3 p-2 rounded-full cursor-pointer"
                style={{ backgroundColor: design.colors.primary }}
                whileHover={{ scale: 1.3 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              </motion.div>
              <motion.div 
                className="absolute bottom-1/3 left-1/2 p-2 rounded-full cursor-pointer"
                style={{ backgroundColor: design.colors.primary }}
                whileHover={{ scale: 1.3 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-6 py-16 border-t" style={{ borderColor: design.colors.primary + '22' }} data-reveal="newsletter">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-medium uppercase tracking-wide mb-2 block" style={{ color: design.colors.primary }}>
              Stay Updated
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>
              Join Our Coffee Club
            </h2>
            <p className="text-gray-600 mb-8" style={{ fontFamily: design.fonts.body }}>
              Get seasonal menu updates, brewing tips, and exclusive offers delivered to your inbox.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <motion.input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-5 py-3 rounded-xl border-2 focus:outline-none transition-colors text-base"
                style={{ 
                  borderColor: newsletterStatus === 'error' ? '#EF4444' : '#E5E7EB',
                  fontFamily: design.fonts.body,
                  backgroundColor: 'white',
                }}
                whileFocus={{ borderColor: design.colors.primary }}
                disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
              />
              <motion.button
                type="submit"
                disabled={newsletterStatus === 'loading' || newsletterStatus === 'success' || !newsletterEmail}
                className="px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap"
                style={{ 
                  backgroundColor: design.colors.primary, 
                  color: 'white',
                  opacity: newsletterStatus === 'loading' || newsletterStatus === 'success' || !newsletterEmail ? 0.5 : 1,
                  fontFamily: design.fonts.body,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {newsletterStatus === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                    Subscribing...
                  </span>
                ) : newsletterStatus === 'success' ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    Subscribed!
                  </span>
                ) : newsletterStatus === 'error' ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                    Try again
                  </span>
                ) : (
                  'Subscribe'
                )}
              </motion.button>
            </form>
            
            <p className="text-xs text-gray-500 mt-4" style={{ fontFamily: design.fonts.body }}>
              No spam, unsubscribe anytime. <a href="#" className="underline" style={{ color: design.colors.primary }}>Privacy Policy</a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t" style={{ borderColor: design.colors.primary + '22' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>☕ Cozy Café</h3>
              <p className="text-gray-600 mb-4" style={{ fontFamily: design.fonts.body }}>
                Crafting moments of warmth, one cup at a time. Since 2024.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors" style={{ fontFamily: design.fonts.body }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors" style={{ fontFamily: design.fonts.body }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-.126-1.283-.072-1.687.07-4.947.196-4.354 2.618-6.78 6.979-6.98 1.281-.058 1.689-.072 4.948-.072z"/></svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors" style={{ fontFamily: design.fonts.body }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>Quick Links</h4>
              <nav className="space-y-2" style={{ fontFamily: design.fonts.body }}>
                <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Menu</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Locations</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Our Story</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Sustainability</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Careers</a>
              </nav>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>Contact</h4>
              <address className="not-italic space-y-2 text-gray-600" style={{ fontFamily: design.fonts.body }}>
                <p>123 Main Street</p>
                <p>City, State 12345</p>
                <p><a href="tel:+1234567890" className="hover:text-gray-900 transition-colors">+1 (234) 567-890</a></p>
                <p><a href="mailto:hello@cozycafe.com" className="hover:text-gray-900 transition-colors">hello@cozycafe.com</a></p>
              </address>
            </div>
          </div>
          
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: design.colors.primary + '22' }}>
            <p className="text-sm text-gray-500" style={{ fontFamily: design.fonts.body }}>
              © 2024 Cozy Café. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500" style={{ fontFamily: design.fonts.body }}>
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${lightboxImage.name} details`}
        >
          <motion.div
            className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: 'white', borderRadius: '24px' }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video relative overflow-hidden rounded-t-2xl">
              <div className="absolute inset-0 flex items-center justify-center text-12xl" style={{ backgroundColor: design.colors.background }}>
                {lightboxImage.image}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-1" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>
                    {lightboxImage.name}
                  </h3>
                  <span className="text-xl font-bold" style={{ color: design.colors.primary, fontFamily: design.fonts.heading }}>
                    {lightboxImage.price}
                  </span>
                </div>
                <button
                  onClick={closeLightbox}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mb-4" style={{ fontFamily: design.fonts.body }}>
                {lightboxImage.desc}
              </p>
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 text-sm font-medium rounded-full"
                  style={{ 
                    backgroundColor: design.colors.primary + '15', 
                    color: design.colors.primary,
                    fontFamily: design.fonts.body 
                  }}
                >
                  {lightboxImage.category.charAt(0).toUpperCase() + lightboxImage.category.slice(1)}
                </span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <motion.span key={star} className="text-yellow-400" whileHover={{ scale: 1.2 }}>★</motion.span>
                  ))}
                </div>
              </div>
              <motion.button
                className="w-full py-3 rounded-xl font-semibold text-lg"
                style={{ backgroundColor: design.colors.primary, color: 'white', fontFamily: design.fonts.body }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add to Order
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}