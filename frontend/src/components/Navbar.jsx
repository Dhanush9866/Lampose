import React from 'react';
import { PlusCircle, LayoutGrid } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="site-header" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      zIndex: 1000,
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
    }}>
      <div className="header-container header-content">
        {/* Brand Logo - Clean dark typography */}
        <div 
          onClick={() => setActiveTab('listings')}
          className="brand-logo"
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <img 
            src="/lampose-logo-splash.png" 
            alt="lampose logo" 
            className="brand-logo-img"
          />
        </div>

        {/* Navigation Action Buttons */}
        <div className="header-nav">
          <button
            onClick={() => setActiveTab('listings')}
            className="nav-btn"
            style={{ 
              background: activeTab === 'listings' ? '#f1f5f2' : '#ffffff',
              borderColor: activeTab === 'listings' ? '#cbd5e1' : '#e2e8f0',
              fontWeight: 600
            }}
          >
            <LayoutGrid size={16} />
            <span>Explore</span>
          </button>

          <button
            onClick={() => setActiveTab('onboard')}
            className="nav-btn nav-btn-primary"
            style={{ 
              fontWeight: 600
            }}
          >
            <PlusCircle size={16} />
            <span>Onboard</span>
          </button>
        </div>
      </div>
    </header>
  );
}
