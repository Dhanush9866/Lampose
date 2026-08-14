import React from 'react';
import { MapPin, Phone, ArrowRight, Clock, Calendar, Wifi, ShieldCheck, Utensils, Zap, Sparkles, Lock } from 'lucide-react';

export default function PropertyCard({ property, onViewDetails }) {
  const {
    name,
    place,
    ownerName,
    ownerMobile,
    category,
    stayType,
    dailyPrice,
    monthlyPrice,
    rent,
    imageUrl,
    amenities = []
  } = property;

  const displayPrice = rent || monthlyPrice || dailyPrice || 0;
  const isDaily = stayType === 'Short Stay' || (category === 'Dormitory' && !monthlyPrice);

  // Take top 3 amenities to feature on card
  const topAmenities = amenities.slice(0, 3);

  return (
    <div className="property-card-wrapper animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '20px',
      overflow: 'hidden',
      position: 'relative',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.03)',
      transition: 'all 0.3s ease'
    }}>
      {/* Image Banner Box */}
      <div className="card-image-box" style={{ position: 'relative', height: '195px', overflow: 'hidden' }}>
        <img
          className="card-image"
          src={imageUrl || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'}
          alt={name}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
        />

        {/* Soft Vignette Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)'
        }} />

        {/* Category Floating Pill Badge (White background top-left) */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
          <span style={{
            background: '#ffffff',
            color: '#181e1b',
            padding: '5px 12px',
            borderRadius: '12px',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <Sparkles size={11} color="#45855a" />
            {category}
          </span>
        </div>

        {/* Stay Type Floating Pill Badge (Dark background top-right) */}
        {stayType && category !== 'Bachelor Room' && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '5px 12px',
              borderRadius: '12px',
              background: '#181e1b',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {stayType.includes('Short') ? <Clock size={12} /> : <Lock size={12} />}
              {stayType}
            </span>
          </div>
        )}

        {/* Floating Rent Tag (White background bottom-right) */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          zIndex: 2,
          background: '#ffffff',
          padding: '6px 14px',
          borderRadius: '14px',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'baseline',
          gap: '2px'
        }}>
          <span style={{ fontSize: '0.85rem', color: '#181e1b', fontWeight: 800 }}>₹</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#181e1b', letterSpacing: '-0.02em' }}>{displayPrice}</span>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
            {isDaily ? '/day' : '/mo'}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* Title */}
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 800,
          color: '#181e1b',
          marginBottom: '6px',
          lineHeight: '1.35',
          fontFamily: "'Outfit', 'Inter', sans-serif"
        }}>
          {name}
        </h3>

        {/* Location Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem', marginBottom: '12px' }}>
          <MapPin size={14} color="#45855a" style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{place}</span>
        </div>

        {/* Featured Mini Amenities Chips */}
        {topAmenities.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
            {topAmenities.map((amenity, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.72rem',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: '#f1f5f2',
                  border: '1px solid #e2e8f0',
                  color: '#475569',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <AmenityIcon name={amenity} />
                <span>{amenity}</span>
              </span>
            ))}
          </div>
        )}

        {/* Owner Info & Direct Contact */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid #f1f5f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px'
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Owner / Manager</span>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#181e1b' }}>
              {ownerName}
            </div>
          </div>

          <a
            href={`tel:${ownerMobile}`}
            className="card-phone-link"
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              background: '#eaf3ed',
              border: '1px solid #c2e2cc',
              color: '#45855a',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              transition: 'all 0.25s ease'
            }}
          >
            <Phone size={13} />
            <span>Call Owner</span>
          </a>
        </div>

        {/* Clean Secondary Action Button */}
        <button
          onClick={() => onViewDetails(property)}
          className="btn card-action-btn-secondary"
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '0.88rem',
            background: '#f8faf8',
            border: '1px solid #e2e8f0',
            color: '#181e1b',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            fontWeight: 600
          }}
        >
          <span>View Full Specifications</span>
          <ArrowRight size={16} className="btn-arrow" style={{ transition: 'transform 0.3s ease' }} />
        </button>
      </div>
    </div>
  );
}

function AmenityIcon({ name }) {
  if (name.includes('WiFi')) return <Wifi size={12} color="#45855a" />;
  if (name.includes('AC')) return <Zap size={12} color="#45855a" />;
  if (name.includes('Food')) return <Utensils size={12} color="#45855a" />;
  return <ShieldCheck size={12} color="#45855a" />;
}
