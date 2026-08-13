import React from 'react';
import { CheckCircle2, ArrowRight, PlusCircle, Building2 } from 'lucide-react';

export default function FormSuccessModal({ property, onViewListings, onResetForm }) {
  if (!property) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} className="animate-fade-in">
      <div className="glass-card" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '32px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(20, 30, 50, 0.95) 0%, rgba(10, 16, 30, 0.95) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.4)'
      }}>
        {/* Success Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          border: '2px solid rgba(16, 185, 129, 0.4)',
          boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
        }}>
          <CheckCircle2 size={40} />
        </div>

        <span className={`badge ${
          property.category === 'PG' ? 'badge-pg' :
          property.category === 'Hostel' ? 'badge-hostel' :
          property.category === 'Dormitory' ? 'badge-dormitory' : 'badge-bachelor'
        }`} style={{ marginBottom: '12px' }}>
          {property.category} Onboarded!
        </span>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
          {property.name}
        </h2>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Successfully stored in database! Owner <strong style={{ color: '#ffffff' }}>{property.ownerName}</strong> ({property.ownerMobile}) is now listed for <strong style={{ color: '#ffffff' }}>{property.place}</strong>.
        </p>

        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '16px',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'left',
          marginBottom: '28px',
          fontSize: '0.875rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Rent:</span>
            <span style={{ color: '#34d399', fontWeight: 700 }}>₹{property.rent}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Location:</span>
            <span style={{ color: '#ffffff' }}>{property.place}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Owner Contact:</span>
            <span style={{ color: '#a5b4fc' }}>{property.ownerMobile}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={onViewListings}
            className="btn btn-primary"
            style={{ flex: 1, padding: '12px 18px' }}
          >
            <span>View All Listings</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={onResetForm}
            className="btn btn-secondary"
            style={{ flex: 1, padding: '12px 18px' }}
          >
            <PlusCircle size={18} />
            <span>Onboard Another</span>
          </button>
        </div>
      </div>
    </div>
  );
}
