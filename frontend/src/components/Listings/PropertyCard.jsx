import React from 'react';
import { MapPin, User, Phone, ArrowUpRight, Clock, Calendar } from 'lucide-react';

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
    categoryDetails = {}
  } = property;

  const badgeClass =
    category === 'PG' ? 'badge-pg' :
    category === 'Hostel' ? 'badge-hostel' :
    category === 'Dormitory' ? 'badge-dormitory' : 'badge-bachelor';

  const displayPrice = rent || monthlyPrice || dailyPrice || 0;
  const isDaily = stayType === 'Short Stay' || (category === 'Dormitory' && !monthlyPrice);

  return (
    <div className="glass-card animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Image Banner */}
      <div style={{ position: 'relative', height: '185px', overflow: 'hidden' }}>
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(25, 64, 44, 0.95) 0%, transparent 60%)'
        }} />

        {/* Category Badge Floating */}
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <span className={`badge ${badgeClass}`}>
            {category}
          </span>
        </div>

        {/* Stay Type Badge Floating */}
        {stayType && (
          <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '12px',
              background: stayType.includes('Short') ? 'rgba(229, 126, 51, 0.9)' : 'rgba(35, 88, 59, 0.9)',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {stayType.includes('Short') ? <Clock size={11} /> : <Calendar size={11} />}
              {stayType}
            </span>
          </div>
        )}

        {/* Rent Tag Floating */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '12px',
          background: 'rgba(25, 64, 44, 0.9)',
          backdropFilter: 'blur(10px)',
          padding: '4px 10px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '2px'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#e57e33' }}>{displayPrice}</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {isDaily ? '/day' : '/mo'}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px', lineHeight: '1.3' }}>
          {name}
        </h3>

        {/* Location Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-sub)', fontSize: '0.82rem', marginBottom: '12px' }}>
          <MapPin size={14} color="#e57e33" />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{place}</span>
        </div>

        {/* Stay Type Pricing Info Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {dailyPrice > 0 && (
            <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(229, 126, 51, 0.15)', color: '#fca966' }}>
              ⏱️ Short Stay: ₹{dailyPrice}/day (1-7 days)
            </span>
          )}
          {monthlyPrice > 0 && (
            <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }}>
              📅 Long Stay: ₹{monthlyPrice}/mo (1+ month)
            </span>
          )}
        </div>

        {/* Owner Info Bar */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Owner / Manager</span>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>
              {ownerName}
            </div>
          </div>

          <a
            href={`tel:${ownerMobile}`}
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              background: 'rgba(229, 126, 51, 0.15)',
              color: '#e57e33',
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none'
            }}
          >
            <Phone size={12} />
            <span>{ownerMobile}</span>
          </a>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onViewDetails(property)}
          className="btn btn-secondary"
          style={{ width: '100%', marginTop: '12px', padding: '8px', fontSize: '0.85rem', minHeight: '36px' }}
        >
          <span>View Full Specifications</span>
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}
