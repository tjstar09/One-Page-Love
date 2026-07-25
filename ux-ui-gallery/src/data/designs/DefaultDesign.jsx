import { motion } from 'framer-motion';

export default function DefaultDesign({ design }) {
  return (
    <div className="w-full h-full p-8" style={{ 
      backgroundColor: design.colors.background,
      color: design.colors.text,
      fontFamily: design.fonts.body,
    }}>
      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
          style={{ backgroundColor: design.colors.primary + '20', color: design.colors.primary }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span>🎨</span> {design.skill} Design
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          style={{ fontFamily: design.fonts.heading, color: design.colors.text }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {design.title}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {design.description}
        </motion.p>

        {/* Interactive Elements Preview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {design.interactiveElements.map((element, i) => (
            <motion.div
              key={i}
              className="p-6 rounded-xl text-left"
              style={{ backgroundColor: 'white', border: `1px solid ${design.colors.primary}22` }}
              whileHover={{ y: -4, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
            >
              <span className="text-3xl mb-2 block">✨</span>
              <h4 className="font-semibold" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>
                {element}
              </h4>
              <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: design.fonts.body }}>
                Interactive demo element
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Color Palette */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>
            Color Palette
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(design.colors).map(([name, color]) => (
              <motion.div
                key={name}
                className="flex flex-col items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <div 
                  className="w-16 h-16 rounded-xl shadow-lg"
                  style={{ backgroundColor: color, border: '1px solid rgba(0,0,0,0.1)' }}
                />
                <div className="text-center">
                  <p className="font-medium text-sm capitalize" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>{name}</p>
                  <p className="text-xs text-gray-500 font-mono">{color}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Typography */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>
            Typography
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="p-6 rounded-xl" style={{ backgroundColor: 'white', border: `1px solid ${design.colors.primary}22` }}>
              <h4 className="font-semibold mb-3" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>Heading Font</h4>
              <p style={{ fontFamily: design.fonts.heading, fontSize: '2rem', fontWeight: 600, color: design.colors.text }}>
                The quick brown fox
              </p>
              <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: design.fonts.body }}>
                {design.fonts.heading}
              </p>
            </div>
            <div className="p-6 rounded-xl" style={{ backgroundColor: 'white', border: `1px solid ${design.colors.primary}22` }}>
              <h4 className="font-semibold mb-3" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>Body Font</h4>
              <p style={{ fontFamily: design.fonts.body, fontSize: '1rem', color: design.colors.text }}>
                The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: design.fonts.body }}>
                {design.fonts.body}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Category & Skill Tags */}
        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <span className="px-4 py-2 rounded-full text-sm font-medium"
            style={{ backgroundColor: design.colors.primary + '15', color: design.colors.primary, fontFamily: design.fonts.body }}
          >
            {design.skill}
          </span>
          <span className="px-4 py-2 rounded-full text-sm font-medium"
            style={{ backgroundColor: design.colors.accent + '15', color: design.colors.accent, fontFamily: design.fonts.body }}
          >
            {design.category}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}