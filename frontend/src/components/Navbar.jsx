import React from 'react';
import { PlusCircle, LayoutGrid } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, counts = {} }) {
  return (
    <header className="site-header" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(25, 64, 44, 0.96)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
    }}>
      <div className="container header-content">
        {/* Brand Logo - Lampose */}
        <div 
          onClick={() => setActiveTab('listings')}
          className="brand-logo"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <span style={{
              fontFamily: "'Outfit', 'Inter', sans-serif",
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em'
            }}>
              Lam
            </span>
            <span style={{
              fontFamily: "'Outfit', 'Inter', sans-serif",
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#e57e33',
              letterSpacing: '-0.02em',
              position: 'relative'
            }}>
              pose
              <span style={{
                position: 'absolute',
                top: '3px',
                right: '3px',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#4ade80'
              }} />
            </span>
          </div>

          {/* Subtitle Badge - Desktop / Tablet only */}
          <span className="portal-badge" style={{
            fontSize: '0.62rem',
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: '10px',
            background: 'rgba(229, 126, 51, 0.2)',
            color: '#fca966',
            border: '1px solid rgba(229, 126, 51, 0.4)',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap'
          }}>
            PORTAL
          </span>
        </div>

        {/* Category Stats Badges - Desktop Only to prevent mobile clutter */}
        <div className="desktop-stats-badges">
          <span className="badge badge-pg">PG: {counts.PG || 0}</span>
          <span className="badge badge-hostel">Hostel: {counts.Hostel || 0}</span>
          <span className="badge badge-dormitory">Dorm: {counts.Dormitory || 0}</span>
          <span className="badge badge-bachelor">Bachelor: {counts['Bachelor Room'] || 0}</span>
        </div>

        {/* Navigation Action Buttons - Sleek Pill Tabs */}
        <div className="header-nav">
          <button
            onClick={() => setActiveTab('listings')}
            className={`btn nav-btn ${activeTab === 'listings' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <LayoutGrid size={15} />
            <span>Explore</span>
          </button>

          <button
            onClick={() => setActiveTab('onboard')}
            className={`btn nav-btn ${activeTab === 'onboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ 
              background: activeTab === 'onboard' ? '#e57e33' : 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff'
            }}
          >
            <PlusCircle size={15} />
            <span>Onboard</span>
          </button>
        </div>
      </div>
    </header>
  );
}
