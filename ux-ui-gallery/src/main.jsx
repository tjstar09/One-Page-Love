import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Announce dynamic content changes to screen readers
function announce(message) {
  const announcer = document.getElementById('a11y-announcer');
  if (announcer) {
    announcer.textContent = '';
    // Force a reflow to ensure the change is announced
    requestAnimationFrame(() => {
      announcer.textContent = message;
    });
  }
}

// Make announce available globally for components
window.__a11yAnnounce = announce;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      {/* Skip to content link - first focusable element on the page */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Screen reader live region for dynamic announcements */}
      <div
        id="a11y-announcer"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <App />
    </>
  </StrictMode>,
)
