import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AgenticLanding({ design }) {
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you today?' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [chatHistory, reducedMotion]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;
    
    const userMessage = { role: 'user', content: inputValue };
    setChatHistory(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
    
    const responses = [
      'I\'ve analyzed your request and prepared a comprehensive response.',
      'That\'s a great question! Let me break this down for you.',
      'I\'ve found several relevant solutions. Here are the top options:',
      'Based on the context, I recommend the following approach:',
    ];
    
    const aiMessage = { 
      role: 'assistant', 
      content: responses[Math.floor(Math.random() * responses.length)] 
    };
    setChatHistory(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  return (
    <div className="w-full h-full" style={{ 
      backgroundColor: design.colors.background,
      color: design.colors.text,
      fontFamily: design.fonts.body,
    }}>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
      `}</style>
      
      {/* Hero Section */}
      <section className="relative min-h-[400px] flex items-center justify-center px-6 py-16">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <motion.div
          className="relative max-w-3xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ backgroundColor: design.colors.primary + '20', color: design.colors.primary }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Powered by Agentic AI
          </motion.span>
          
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: design.fonts.heading, color: design.colors.text }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Conversational AI that{' '}
            <span style={{ color: design.colors.primary }}>gets things done</span>
          </motion.h1>
          
          <motion.p
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Experience the future of AI interaction with a chat interface that understands context, executes tasks, and delivers results.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              className="px-8 py-4 rounded-xl font-semibold text-lg transition-all"
              style={{ 
                backgroundColor: design.colors.primary, 
                color: 'white',
                fontFamily: design.fonts.body,
              }}
              whileHover={{ scale: 1.02, boxShadow: `0 10px 30px -5px ${design.colors.primary}CC` }}
              whileTap={{ scale: 0.98 }}
            >
              Start Conversation
            </motion.button>
            <motion.button
              className="px-8 py-4 rounded-xl font-semibold text-lg transition-all border-2"
              style={{ 
                borderColor: design.colors.primary,
                color: design.colors.primary,
                fontFamily: design.fonts.body,
              }}
              whileHover={{ backgroundColor: design.colors.primary + '10' }}
              whileTap={{ scale: 0.98 }}
            >
              Watch Demo
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Chat Interface Preview */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: 'white', border: `1px solid ${design.colors.primary}33` }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Chat Header */}
            <div className="px-6 py-4 border-b" style={{ borderColor: design.colors.primary + '33' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: design.colors.primary }}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>Agentic Assistant</h3>
                  <p className="text-sm text-gray-500">Online • Ready to help</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-[400px] overflow-y-auto p-6 space-y-6" style={{ fontFamily: design.fonts.body }}>
              {chatHistory.map((message, index) => (
                <motion.div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className="max-w-[80%] px-5 py-3 rounded-2xl"
                    style={{
                      backgroundColor: message.role === 'user' ? design.colors.primary : '#F3F4F6',
                      color: message.role === 'user' ? 'white' : design.colors.text,
                      borderRadius: message.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <p className="text-base leading-relaxed">{message.content}</p>
                    <span className="text-xs opacity-60 mt-1 block text-right">
                      {message.role === 'user' ? 'You' : 'AI'} • Just now
                    </span>
                  </motion.div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="px-5 py-3 rounded-2xl bg-gray-100" style={{ borderRadius: '20px 20px 20px 4px' }}>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="px-4 py-4 border-t" style={{ borderColor: design.colors.primary + '33' }}>
              <div className="flex gap-3">
                <motion.input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-5 py-3 rounded-xl border-2 focus:outline-none transition-colors text-base"
                  style={{ 
                    borderColor: '#E5E7EB',
                    fontFamily: design.fonts.body,
                    backgroundColor: 'white',
                  }}
                  whileFocus={{ borderColor: design.colors.primary }}
                />
                <motion.button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{ 
                    backgroundColor: design.colors.primary, 
                    color: 'white',
                    opacity: !inputValue.trim() || isTyping ? 0.5 : 1,
                    fontFamily: design.fonts.body,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {[
              { icon: '⚡', title: 'Instant Responses', desc: 'Sub-second latency for seamless conversation flow' },
              { icon: '🧠', title: 'Context Aware', desc: 'Remembers conversation history and user preferences' },
              { icon: '🔧', title: 'Task Execution', desc: 'Actually completes tasks, not just suggests them' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-2xl transition-all"
                style={{ backgroundColor: 'white', border: `1px solid ${design.colors.primary}22` }}
                whileHover={{ y: -4, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
              >
                <span className="text-4xl mb-3 block">{feature.icon}</span>
                <h4 className="font-semibold text-lg mb-2" style={{ color: design.colors.text, fontFamily: design.fonts.heading }}>
                  {feature.title}
                </h4>
                <p className="text-gray-600" style={{ fontFamily: design.fonts.body }}>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Reduced Motion Toggle */}
      <section className="px-6 py-8 border-t" style={{ borderColor: design.colors.primary + '22' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="w-5 h-5 rounded border-2 focus:outline-none focus:ring-2"
              style={{ 
                borderColor: design.colors.primary,
                accentColor: design.colors.primary,
              }}
            />
            <span className="text-sm text-gray-600" style={{ fontFamily: design.fonts.body }}>
              Reduced Motion
            </span>
          </label>
        </div>
      </section>
    </div>
  );
}
