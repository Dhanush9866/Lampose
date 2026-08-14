import React from 'react';
import { CheckCircle2, ArrowRight, PlusCircle, Building2, MapPin, User, Phone } from 'lucide-react';

export default function FormSuccessModal({ property, onViewListings, onResetForm }) {
  if (!property) return null;

  const { name, place, ownerName, ownerMobile, category, rent, dailyPrice, monthlyPrice, stayType } = property;
  const displayPrice = rent || monthlyPrice || dailyPrice || 0;

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onViewListings(); }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto'
      }} 
      className="animate-fade-in"
    >
      <div style={{
        maxWidth: '520px',
        width: '100%',
        padding: '32px 24px',
        textAlign: 'center',
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Success Animated Badge */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#eaf3ed',
          border: '2px solid #45855a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: '#45855a'
        }}>
          <CheckCircle2 size={36} />
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#181e1b', marginBottom: '6px' }}>
          Property Onboarded Successfully!
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px' }}>
          Your accommodation listing has been saved directly to MongoDB Atlas and is now live!
        </p>

        {/* Property Brief Summary Box */}
        <div style={{
          padding: '16px',
          borderRadius: '16px',
          background: '#f8faf8',
          border: '1px solid #e2e8f0',
          textAlign: 'left',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '10px', background: '#45855a', color: '#ffffff' }}>
              {category} {stayType ? `• ${stayType}` : ''}
            </span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#45855a' }}>
              ₹{displayPrice} {stayType === 'Short Stay' ? '/day' : '/mo'}
            </span>
          </div>

          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#181e1b' }}>{name}</h4>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748b' }}>
            <MapPin size={14} color="#45855a" />
            <span>{place}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: '#64748b', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
            <span><strong style={{ color: '#181e1b' }}>Owner:</strong> {ownerName}</span>
            <span><strong style={{ color: '#181e1b' }}>Contact:</strong> {ownerMobile}</span>
          </div>
        </div>

        {/* Modal Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={onViewListings}
            className="btn btn-primary"
            style={{ padding: '12px 24px', background: '#45855a' }}
          >
            <span>View Live Listings</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={onResetForm}
            className="btn btn-secondary"
            style={{ padding: '12px 20px' }}
          >
            <PlusCircle size={16} />
            <span>Onboard Another</span>
          </button>
        </div>
      </div>
    </div>
  );
}
