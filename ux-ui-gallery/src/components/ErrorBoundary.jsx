import { Component } from 'react';
import { motion } from 'framer-motion';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Design component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const design = this.props.design || {};
      return (
        <motion.div
          className="flex flex-col items-center justify-center p-12 text-center min-h-[400px]"
          style={{ backgroundColor: design.colors?.background || '#F9FAFB' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          role="alert"
          aria-live="assertive"
        >
          <motion.div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
            style={{ backgroundColor: (design.colors?.primary || '#EF4444') + '15' }}
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            aria-hidden="true"
          >
            <svg className="w-10 h-10" style={{ color: design.colors?.primary || '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </motion.div>

          <h3 className="text-xl font-semibold mb-2" style={{ color: design.colors?.text || '#111827', fontFamily: design.fonts?.heading || 'inherit' }} id="error-boundary-heading">
            Design Preview Unavailable
          </h3>
          
          <p className="text-gray-500 mb-6 max-w-md mx-auto" style={{ fontFamily: design.fonts?.body || 'inherit' }} aria-describedby="error-boundary-heading">
            This interactive template encountered an error while rendering. The design data is still available for download.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <motion.button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-5 py-2.5 rounded-lg font-medium text-sm text-white"
              style={{ backgroundColor: design.colors?.primary || '#3B82F6' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Retry loading the design template"
            >
              Try Again
            </motion.button>
            
            <motion.a
              href={design.downloadUrl || '#'}
              download
              className="px-5 py-2.5 rounded-lg font-medium text-sm border-2"
              style={{ borderColor: design.colors?.primary || '#3B82F6', color: design.colors?.primary || '#3B82F6' }}
              whileHover={{ backgroundColor: (design.colors?.primary || '#3B82F6') + '10' }}
              whileTap={{ scale: 0.98 }}
              aria-label={`Download ${design.title || 'design'} template`}
            >
              Download Template
            </motion.a>
          </div>

          {/* Design info fallback */}
          <div className="mt-8 p-4 rounded-xl max-w-md w-full text-left" style={{ backgroundColor: 'white', border: `1px solid ${(design.colors?.primary || '#E5E7EB')}22` }}>
            <h4 className="font-semibold text-sm mb-2" style={{ color: design.colors?.text || '#111827' }}>{design.title || 'Design Template'}</h4>
            <div className="flex flex-wrap gap-2 text-xs" style={{ color: '#6B7280' }}>
              <span className="px-2 py-1 rounded" style={{ backgroundColor: (design.colors?.primary || '#E5E7EB') + '15', color: design.colors?.primary || '#6B7280' }}>
                {design.skill || 'N/A'}
              </span>
              <span className="px-2 py-1 rounded" style={{ backgroundColor: (design.colors?.accent || '#E5E7EB') + '15', color: design.colors?.accent || '#6B7280' }}>
                {design.category || 'N/A'}
              </span>
              <span className="px-2 py-1 rounded bg-gray-100 text-gray-600">
                ID: {design.id || 'N/A'}
              </span>
            </div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}