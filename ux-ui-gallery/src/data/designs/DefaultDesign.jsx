import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import anime from 'animejs';
import { useDesignTextEffects } from '../../hooks/useDesignTextEffects';

// ─── Category-specific layout generators ───────────────────────────────────────

function LandingPageLayout({ design, textFx }) {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center px-6 py-20 overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: design.colors.primary }} />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: design.colors.accent }} />
        </div>
        <motion.div className="relative max-w-4xl mx-auto text-center" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <motion.span className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: design.colors.primary + '20', color: design.colors.primary }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            ✦ {design.skill.charAt(0).toUpperCase() + design.skill.slice(1)} Design
          </motion.span>
          <motion.h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${textFx.getHeadingClasses()}`} style={{ fontFamily: design.fonts.heading, color: design.colors.text }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            {design.title}
          </motion.h1>
          <motion.p className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${textFx.getBodyClasses()}`} style={{ color: design.colors.text + 'CC' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            {design.description}
          </motion.p>
          <motion.div className="flex flex-wrap justify-center gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <motion.button className="px-8 py-4 rounded-xl font-semibold text-lg text-white" style={{ backgroundColor: design.colors.primary }} whileHover={{ scale: 1.02, boxShadow: `0 10px 30px -5px ${design.colors.primary}CC` }} whileTap={{ scale: 0.98 }}>
              Get Started
            </motion.button>
            <motion.button className="px-8 py-4 rounded-xl font-semibold text-lg border-2" style={{ borderColor: design.colors.primary, color: design.colors.primary }} whileHover={{ backgroundColor: design.colors.primary + '10' }} whileTap={{ scale: 0.98 }}>
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${textFx.getHeadingClasses()}`} style={{ fontFamily: design.fonts.heading, color: design.colors.text }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Key Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {design.interactiveElements.slice(0, 6).map((element, i) => (
              <motion.div key={i} className="p-6 rounded-2xl" style={{ backgroundColor: 'white', border: `1px solid ${design.colors.primary}22` }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{ backgroundColor: design.colors.primary + '15' }}>✦</div>
                <h3 className={`font-semibold text-lg mb-2 ${textFx.getHeadingClasses()}`} style={{ fontFamily: design.fonts.heading, color: design.colors.text }}>{element}</h3>
                <p className={`text-sm ${textFx.getBodyClasses()}`} style={{ color: design.colors.text + '99' }}>Interactive component with smooth animations and responsive behavior.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Color & Typography */}
      <ColorTypographySection design={design} textFx={textFx} />
    </div>
  );
}

function DashboardLayout({ design, textFx }) {
  return (
    <div className="space-y-16">
      {/* Dashboard Header */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div className="flex items-center justify-between mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div>
              <motion.h1 className={`text-3xl md:text-5xl font-bold ${textFx.getHeadingClasses()}`} style={{ fontFamily: design.fonts.heading, color: design.colors.text }}>{design.title}</motion.h1>
              <motion.p className={`mt-2 ${textFx.getBodyClasses()}`} style={{ color: design.colors.text + '99' }}>{design.description}</motion.p>
            </div>
            <motion.button className="px-5 py-2.5 rounded-lg font-medium text-sm text-white" style={{ backgroundColor: design.colors.primary }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Export</motion.button>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {['Total Revenue', 'Active Users', 'Conversion', 'Growth'].map((kpi, i) => (
              <motion.div key={i} className="p-5 rounded-xl" style={{ backgroundColor: 'white', border: `1px solid ${design.colors.primary}22` }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -2 }}>
                <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${textFx.getBodyClasses()}`} style={{ color: design.colors.text + '77' }}>{kpi}</p>
                <p className={`text-2xl font-bold ${textFx.getHeadingClasses()}`} style={{ color: design.colors.primary, fontFamily: design.fonts.heading }}>{['$128.5K', '24,850', '12.4%', '+8.2%'][i]}</p>
              </motion.div>
            ))}
          </div>

          {/* Interactive Elements as Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {design.interactiveElements.slice(0, 4).map((element, i) => (
              <motion.div key={i} className="p-6 rounded-xl" style={{ backgroundColor: 'white', border: `1px solid ${design.colors.primary}22` }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ boxShadow: '0 10px 30px -5px rgba(0,0,0,0.08)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: design.colors.primary }} />
                  <h3 className={`font-semibold ${textFx.getHeadingClasses()}`} style={{ fontFamily: design.fonts.heading, color: design.colors.text }}>{element}</h3>
                </div>
                <div className="h-24 rounded-lg" style={{ backgroundColor: design.colors.primary + '08' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ColorTypographySection design={design} textFx={textFx} />
    </div>
  );
}

function ApplicationLayout({ design, textFx }) {
  return (
    <div className="space-y-16">
      {/* App Header */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div className="flex items-center gap-4 mb-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: design.colors.primary + '20' }}>⚡</div>
            <div>
              <motion.h1 className={`text-3xl md:text-5xl font-bold ${textFx.getHeadingClasses()}`} style={{ fontFamily: design.fonts.heading, color: design.colors.text }}>{design.title}</motion.h1>
              <motion.p className={`mt-1 ${textFx.getBodyClasses()}`} style={{ color: design.colors.text + '99' }}>{design.description}</motion.p>
            </div>
          </motion.div>

          {/* Toolbar */}
          <motion.div className="flex flex-wrap gap-3 mb-8 p-4 rounded-xl" style={{ backgroundColor: 'white', border: `1px solid ${design.colors.primary}22` }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {['File', 'Edit', 'View', 'Tools', 'Help'].map((item, i) => (
              <motion.button key={i} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ color: design.colors.text + 'AA' }} whileHover={{ backgroundColor: design.colors.primary + '10', color: design.colors.primary }}>
                {item}
              </motion.button>
            ))}
          </motion.div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <motion.div className="lg:col-span-1 space-y-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              {design.interactiveElements.slice(0, 5).map((element, i) => (
                <motion.div key={i} className="p-4 rounded-xl cursor-pointer" style={{ backgroundColor: 'white', border: `1px solid ${design.colors.primary}22` }} whileHover={{ x: 4, borderColor: design.colors.primary }}>
                  <p className={`text-sm font-medium ${textFx.getBodyClasses()}`} style={{ color: design.colors.text }}>{element}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Content Panel */}
            <motion.div className="lg:col-span-2 p-8 rounded-2xl min-h-[400px]" style={{ backgroundColor: 'white', border: `1px solid ${design.colors.primary}22` }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="space-y-4">
                <div className="h-4 rounded w-3/4" style={{ backgroundColor: design.colors.primary + '10' }} />
                <div className="h-4 rounded w-1/2" style={{ backgroundColor: design.colors.primary + '10' }} />
                <div className="h-4 rounded w-5/6" style={{ backgroundColor: design.colors.primary + '10' }} />
                <div className="h-4 rounded w-2/3" style={{ backgroundColor: design.colors.primary + '10' }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <ColorTypographySection design={design} textFx={textFx} />
    </div>
  );
}

function EditorialLayout({ design, textFx }) {
  return (
    <div className="space-y-16">
      {/* Magazine Header */}
      <section className="px-6 py-16 border-b" style={{ borderColor: design.colors.primary + '22' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.span className="text-sm font-medium uppercase tracking-[0.2em] mb-4 block" style={{ color: design.colors.primary }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {design.category}
          </motion.span>
          <motion.h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${textFx.getHeadingClasses()}`} style={{ fontFamily: design.fonts.heading, color: design.colors.text }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {design.title}
          </motion.h1>
          <motion.p className={`text-lg leading-relaxed max-w-2xl mx-auto ${textFx.getBodyClasses()}`} style={{ color: design.colors.text + '99' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            {design.description}
          </motion.p>
        </div>
      </section>

      {/* Article Grid */}
      <section className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {design.interactiveElements.slice(0, 6).map((element, i) => (
              <motion.article key={i} className="group" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="aspect-[4/3] rounded-2xl mb-4 overflow-hidden" style={{ backgroundColor: design.colors.primary + '10' }}>
                  <div className="w-full h-full flex items-center justify-center text-4xl" style={{ color: design.colors.primary + '44' }}>✦</div>
                </div>
                <h3 className={`font-bold text-xl mb-2 group-hover:underline ${textFx.getHeadingClasses()}`} style={{ fontFamily: design.fonts.heading, color: design.colors.text }}>{element}</h3>
                <p className={`text-sm ${textFx.getBodyClasses()}`} style={{ color: design.colors.text + '77' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <ColorTypographySection design={design} textFx={textFx} />
    </div>
  );
}

function ExperimentalLayout({ design, textFx }) {
  return (
    <div className="space-y-16">
      {/* Bold Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-6 py-20 overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ background: `linear-gradient(135deg, ${design.colors.primary} 0%, ${design.colors.accent} 50%, ${design.colors.background} 100%)` }} />
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: design.colors.primary + '30' }} />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: design.colors.accent + '30' }} />
        </div>
        <motion.div className="relative max-w-4xl mx-auto text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
          <motion.div className="text-7xl md:text-9xl font-black mb-6 leading-none" style={{ fontFamily: design.fonts.heading, color: design.colors.primary, WebkitTextStroke: `2px ${design.colors.text}` }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}>
            {design.title.split(' ')[0]}
          </motion.div>
          <motion.h1 className={`text-3xl md:text-5xl font-bold mb-6 ${textFx.getHeadingClasses()}`} style={{ fontFamily: design.fonts.heading, color: design.colors.text }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            {design.title}
          </motion.h1>
          <motion.p className={`text-lg mb-10 max-w-2xl mx-auto ${textFx.getBodyClasses()}`} style={{ color: design.colors.text + 'AA' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            {design.description}
          </motion.p>
        </motion.div>
      </section>

      {/* Experimental Grid */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {design.interactiveElements.map((element, i) => (
              <motion.div key={i} className="aspect-square rounded-2xl flex items-center justify-center p-4 text-center cursor-pointer" style={{ backgroundColor: i % 2 === 0 ? design.colors.primary : design.colors.accent, color: 'white' }} initial={{ opacity: 0, rotate: -10 }} whileInView={{ opacity: 1, rotate: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.1, rotate: 5, zIndex: 10 }}>
                <p className={`text-xs md:text-sm font-bold leading-tight ${textFx.getAccentClasses()}`} style={{ fontFamily: design.fonts.heading }}>{element}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ColorTypographySection design={design} textFx={textFx} />
    </div>
  );
}

// ─── Shared Color & Typography Section ─────────────────────────────────────────

function ColorTypographySection({ design, textFx }) {
  return (
    <section className="px-6 py-16 border-t" style={{ borderColor: design.colors.primary + '22' }}>
      <div className="max-w-4xl mx-auto">
        <motion.h2 className={`text-2xl md:text-3xl font-bold text-center mb-10 ${textFx.getHeadingClasses()}`} style={{ fontFamily: design.fonts.heading, color: design.colors.text }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          Design System
        </motion.h2>

        {/* Color Palette */}
        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className={`font-semibold text-lg mb-6 text-center ${textFx.getHeadingClasses()}`} style={{ fontFamily: design.fonts.heading, color: design.colors.text }}>Color Palette</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(design.colors).map(([name, color]) => (
              <motion.div key={name} className="flex flex-col items-center gap-2" whileHover={{ scale: 1.05, y: -4 }}>
                <div className="w-16 h-16 rounded-xl shadow-lg" style={{ backgroundColor: color, border: '2px solid rgba(0,0,0,0.08)' }} />
                <div className="text-center">
                  <p className={`font-medium text-sm capitalize ${textFx.getBodyClasses()}`} style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>{name}</p>
                  <p className="text-xs font-mono" style={{ color: design.colors.text + '77' }}>{color}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Typography */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className={`font-semibold text-lg mb-6 text-center ${textFx.getHeadingClasses()}`} style={{ fontFamily: design.fonts.heading, color: design.colors.text }}>Typography</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl" style={{ backgroundColor: 'white', border: `1px solid ${design.colors.primary}22` }}>
              <h4 className={`font-semibold mb-3 ${textFx.getHeadingClasses()}`} style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>Heading</h4>
              <p style={{ fontFamily: design.fonts.heading, fontSize: '1.75rem', fontWeight: 700, color: design.colors.text }}>The quick brown fox</p>
              <p className={`text-sm mt-2 ${textFx.getBodyClasses()}`} style={{ color: design.colors.text + '77' }}>{design.fonts.heading}</p>
            </div>
            <div className="p-6 rounded-xl" style={{ backgroundColor: 'white', border: `1px solid ${design.colors.primary}22` }}>
              <h4 className={`font-semibold mb-3 ${textFx.getHeadingClasses()}`} style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>Body</h4>
              <p style={{ fontFamily: design.fonts.body, fontSize: '1rem', color: design.colors.text }}>The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.</p>
              <p className={`text-sm mt-2 ${textFx.getBodyClasses()}`} style={{ color: design.colors.text + '77' }}>{design.fonts.body}</p>
            </div>
          </div>
        </motion.div>

        {/* Skill & Category Tags */}
        <motion.div className="flex flex-wrap justify-center gap-3 mt-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <span className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: design.colors.primary + '15', color: design.colors.primary }}>{design.skill}</span>
          <span className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: design.colors.accent + '15', color: design.colors.accent }}>{design.category}</span>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Text Animation Components ─────────────────────────────────────────────────

function AnimatedHeading({ text, design, className = '', as: Tag = 'h2', ...props }) {
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          // Anime.js letter animation
          const letters = el.querySelectorAll('.letter');
          anime.timeline({ easing: 'easeOutExpo' })
            .add({
              targets: letters,
              translateY: [40, 0],
              opacity: [0, 1],
              rotateX: [90, 0],
              duration: 600,
              delay: anime.stagger(40),
            });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  // Split text into letters wrapped in spans
  const letters = text.split('').map((char, i) => (
    <span key={i} className="letter inline-block" style={{ opacity: 0 }}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  return (
    <Tag ref={ref} className={className} style={{ fontFamily: design.fonts.heading, color: design.colors.text }} {...props}>
      {letters}
    </Tag>
  );
}

function TypewriterText({ text, design, className = '', speed = 40, startDelay = 300 }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timer);
  }, [text, speed, startDelay]);

  return (
    <span className={className} style={{ fontFamily: design.fonts.body, color: design.colors.text }}>
      {displayed}
      {!done && <span className="animate-pulse" style={{ color: design.colors.primary }}>|</span>}
    </span>
  );
}

// ─── Main DefaultDesign Component ──────────────────────────────────────────────

export default function DefaultDesign({ design }) {
  const textFx = useDesignTextEffects(design.skill);

  // Determine which layout to use based on category
  const getLayout = () => {
    const category = design.category?.toLowerCase() || '';
    if (category.includes('dashboard') || category.includes('data')) return 'dashboard';
    if (category.includes('application') || category.includes('tool')) return 'application';
    if (category.includes('editorial') || category.includes('content')) return 'editorial';
    if (category.includes('experimental') || category.includes('playful')) return 'experimental';
    return 'landing'; // default
  };

  const layout = getLayout();

  const renderLayout = () => {
    const props = { design, textFx };
    switch (layout) {
      case 'dashboard': return <DashboardLayout {...props} />;
      case 'application': return <ApplicationLayout {...props} />;
      case 'editorial': return <EditorialLayout {...props} />;
      case 'experimental': return <ExperimentalLayout {...props} />;
      default: return <LandingPageLayout {...props} />;
    }
  };

  return (
    <div className="w-full min-h-full" style={{ backgroundColor: design.colors.background, color: design.colors.text }}>
      {/* Animated skill badge in header */}
      <div className="px-6 pt-6">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
          style={{ backgroundColor: design.colors.primary + '15', color: design.colors.primary }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <AnimatedHeading text={design.skill.charAt(0).toUpperCase() + design.skill.slice(1)} design={design} as="span" className="text-sm font-medium" />
        </motion.div>
      </div>

      {renderLayout()}

      {/* Footer */}
      <footer className="px-6 py-8 border-t" style={{ borderColor: design.colors.primary + '22' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className={`text-sm ${textFx.getBodyClasses()}`} style={{ color: design.colors.text + '77' }}>
            {design.title} — {design.skill} Design Template
          </p>
          <div className="flex gap-4 text-sm" style={{ color: design.colors.text + '77' }}>
            <span>{design.interactiveElements.length} interactive elements</span>
            <span>•</span>
            <span>{design.category}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}