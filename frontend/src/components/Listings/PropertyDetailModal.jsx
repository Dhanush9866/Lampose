import React, { useState, useEffect } from 'react';
import { X, MapPin, User, Phone, ShieldCheck, Trash2, CheckCircle2, Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PropertyDetailModal({ property, onClose, onDelete }) {
  if (!property) return null;

  const {
    _id,
    name,
    place,
    ownerName,
    ownerMobile,
    category,
    stayType = 'Long Stay',
    shortStayDuration = '1-7 Days',
    dailyPrice = 0,
    longStayDuration = '1 Month+',
    monthlyPrice = 0,
    deposit,
    address,
    imageUrl,
    images = [],
    employeeEmail,
    amenities = [],
    categoryDetails = {}
  } = property;

  const allImages = Array.isArray(images) && images.length > 0
    ? images
    : (imageUrl && imageUrl.trim() ? [imageUrl] : ['/lampose-logo-splash.png']);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [isBannerHovered, setIsBannerHovered] = useState(false);

  const currentImage = allImages[activeImageIndex] || allImages[0] || '/lampose-logo-splash.png';
  const isSplashImage = currentImage?.includes('splash') || currentImage?.includes('logo');

  const badgeClass =
    category === 'PG' ? 'badge-pg' :
    category === 'Hostel' ? 'badge-hostel' :
    category === 'Dormitory' ? 'badge-dormitory' : 'badge-bachelor';

  // Auto-scroll through photos every 4 seconds (pauses on hover)
  useEffect(() => {
    if (allImages.length <= 1 || isBannerHovered) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
    }, 4000);

    return () => clearInterval(interval);
  }, [allImages.length, isBannerHovered]);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation for image carousel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allImages.length]);

  // Touch swipe handling for mobile devices
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;
    if (diffX > 50) {
      handleNext();
    } else if (diffX < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
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
        padding: '20px 14px',
        overflowY: 'auto'
      }} 
      className="animate-fade-in"
    >
      <div className="modal-content" style={{
        maxWidth: '720px',
        width: '100%',
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto',
        position: 'relative',
        padding: '0',
        borderRadius: '24px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        margin: 'auto'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            zIndex: 20,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#181e1b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            touchAction: 'manipulation',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          <X size={20} />
        </button>

        {/* Interactive Hero Image Banner Carousel */}
        <div 
          style={{ position: 'relative', height: '280px', background: isSplashImage ? '#f6f8f6' : '#181e1b', overflow: 'hidden' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsBannerHovered(true)}
          onMouseLeave={() => setIsBannerHovered(false)}
        >
          <img
            key={activeImageIndex}
            src={currentImage}
            alt={`${name} - Photo ${activeImageIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: isSplashImage ? 'contain' : 'cover',
              padding: isSplashImage ? '24px' : '0',
              transition: 'opacity 0.3s ease'
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
            pointerEvents: 'none'
          }} />

          {/* Carousel Next & Prev Controls (if > 1 image) */}
          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.92)',
                  border: 'none',
                  color: '#181e1b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  transition: 'all 0.2s ease'
                }}
                title="Previous photo (or Left Arrow key)"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.92)',
                  border: 'none',
                  color: '#181e1b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  transition: 'all 0.2s ease'
                }}
                title="Next photo (or Right Arrow key)"
              >
                <ChevronRight size={22} />
              </button>

              {/* Photo Index Counter Badge */}
              <div style={{
                position: 'absolute',
                top: '14px',
                left: '16px',
                zIndex: 10,
                background: 'rgba(0, 0, 0, 0.65)',
                color: '#ffffff',
                padding: '5px 12px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span>📷 {activeImageIndex + 1} / {allImages.length} Photos</span>
              </div>

              {/* Pagination Dots on Banner */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '4px 10px',
                borderRadius: '14px',
                backdropFilter: 'blur(4px)'
              }}>
                {allImages.map((_, dotIdx) => {
                  const isActive = dotIdx === activeImageIndex;
                  return (
                    <span
                      key={dotIdx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(dotIdx);
                      }}
                      style={{
                        width: isActive ? '14px' : '6px',
                        height: '6px',
                        borderRadius: '4px',
                        background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  );
                })}
              </div>
            </>
          )}

          {/* Banner Title & Place Details */}
          <div style={{ position: 'absolute', bottom: allImages.length > 1 ? '32px' : '16px', left: '20px', right: '20px', zIndex: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className={`badge ${badgeClass}`} style={{ background: '#ffffff', color: '#181e1b', border: 'none', fontWeight: 700 }}>
                {category}
              </span>
              {category !== 'Bachelor Room' && stayType && (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', background: '#181e1b', color: '#ffffff' }}>
                  {stayType}
                </span>
              )}
            </div>
            <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', fontWeight: 800, color: '#ffffff', lineHeight: '1.2', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              {name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff', fontSize: '0.86rem', marginTop: '4px', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              <MapPin size={15} color="#fadf5d" />
              <span>{place}</span>
            </div>
          </div>
        </div>

        {/* Thumbnail Gallery Strip (if > 1 image) */}
        {allImages.length > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            background: '#f8faf8',
            borderBottom: '1px solid #e2e8f0',
            overflowX: 'auto'
          }}>
            {allImages.map((thumbUrl, idx) => {
              const isSelected = idx === activeImageIndex;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    width: '74px',
                    height: '50px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid #45855a' : '1px solid #cbd5e1',
                    opacity: isSelected ? 1 : 0.65,
                    transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={thumbUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Content Body */}
        <div style={{ padding: '24px 20px' }}>
          {/* Stay Type & Pricing Structure */}
          <div style={{
            padding: '16px 20px',
            borderRadius: '16px',
            background: '#f8faf8',
            border: '1px solid #e2e8f0',
            marginBottom: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px'
          }}>
            {dailyPrice > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#45855a', fontSize: '0.78rem', fontWeight: 600 }}>
                  <Clock size={14} />
                  <span>Short Stay (1-7 Days)</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#181e1b', marginTop: '2px' }}>
                  ₹{dailyPrice} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ day</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Option: {shortStayDuration}</span>
              </div>
            )}

            {monthlyPrice > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#45855a', fontSize: '0.78rem', fontWeight: 600 }}>
                  <Calendar size={14} color="#45855a" />
                  <span>{category === 'Bachelor Room' ? 'Monthly Rent' : 'Long Stay (1+ Month)'}</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#45855a', marginTop: '2px' }}>
                  ₹{monthlyPrice} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ month</span>
                </div>
                {category !== 'Bachelor Room' && longStayDuration && (
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Option: {longStayDuration}</span>
                )}
              </div>
            )}

            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>Security Deposit</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#181e1b', marginTop: '2px' }}>
                ₹{deposit || 0}
              </div>
            </div>

            <a
              href={`tel:${ownerMobile}`}
              className="btn btn-primary"
              style={{ padding: '12px 18px', width: '100%', gridColumn: '1 / -1', background: '#45855a', borderRadius: '12px', fontSize: '0.95rem' }}
            >
              <Phone size={18} />
              <span>Call Owner ({ownerMobile})</span>
            </a>
          </div>

          {/* Owner Details Card */}
          <div style={{
            padding: '16px',
            borderRadius: '16px',
            background: '#f8faf8',
            border: '1px solid #e2e8f0',
            marginBottom: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Owner Name:</span>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#181e1b', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <User size={16} color="#45855a" />
                <span>{ownerName}</span>
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Contact:</span>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#45855a', marginTop: '2px' }}>
                {ownerMobile}
              </div>
            </div>
            {address && (
              <div style={{ width: '100%', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Street Address:</span>
                <p style={{ fontSize: '0.85rem', color: '#181e1b', marginTop: '2px', lineHeight: '1.4' }}>{address}</p>
              </div>
            )}
            {employeeEmail && (
              <div style={{ width: '100%', paddingTop: '10px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Onboarded By Employee:</span>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#45855a' }}>{employeeEmail}</span>
              </div>
            )}
          </div>

          {/* Category Specific Detailed Breakdown */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '1.05rem', color: '#181e1b', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#45855a" />
              <span>{category} Category Parameters</span>
            </h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '10px'
            }}>
              {/* PG Specs */}
              {category === 'PG' && (
                <>
                  <SpecItem label="Food Status" value={categoryDetails.foodIncluded ? `Provided (${categoryDetails.foodType || 'Veg/Non-Veg'})` : 'No Food'} />
                  <SpecItem label="AC Available" value={categoryDetails.acAvailable ? 'Yes (AC Rooms)' : 'Non-AC Only'} />
                  <SpecItem label="Sharing Types" value={Array.isArray(categoryDetails.sharingTypes) ? categoryDetails.sharingTypes.join(', ') : 'Single, 2 Sharing'} />
                  <SpecItem label="Curfew Timing" value={categoryDetails.curfewTime || 'No Curfew'} />
                  <SpecItem label="Housekeeping" value={categoryDetails.housekeeping ? 'Daily Included' : 'Standard'} />
                </>
              )}

              {/* Hostel Specs */}
              {category === 'Hostel' && (
                <>
                  <SpecItem label="Hostel Category" value={categoryDetails.hostelType || 'Boys Hostel'} />
                  <SpecItem label="Mess / Canteen" value={categoryDetails.canteenFacility ? 'In-house Mess Available' : 'No Mess'} />
                  <SpecItem label="Warden Contact" value={categoryDetails.wardenContact || ownerMobile} />
                  <SpecItem label="Security & CCTV" value={categoryDetails.securityCCTV ? '24/7 Security & CCTV' : 'Standard'} />
                  <SpecItem label="Study Room" value={categoryDetails.studyRoom ? 'Available' : 'N/A'} />
                </>
              )}

              {/* Dormitory Specs */}
              {category === 'Dormitory' && (
                <>
                  <SpecItem label="Total Beds" value={`${categoryDetails.totalBeds || 12} Beds`} />
                  <SpecItem label="Pricing Rate" value={categoryDetails.rateType || 'Daily Rate'} />
                  <SpecItem label="Bed Format" value={categoryDetails.bedType || 'Bunk Bed Pod'} />
                  <SpecItem label="Shared Washrooms" value={`${categoryDetails.washroomsCount || 4} Washrooms`} />
                  <SpecItem label="Personal Lockers" value={categoryDetails.lockersAvailable ? 'Included with Key' : 'N/A'} />
                </>
              )}

              {/* Bachelor Room Specs */}
              {category === 'Bachelor Room' && (
                <>
                  <SpecItem label="Room Layout" value={categoryDetails.roomType || '1 BHK'} />
                  <SpecItem label="Furnishing" value={categoryDetails.furnishing || 'Semi-Furnished'} />
                  <SpecItem label="Allowed Tenants" value={categoryDetails.allowedTenants || 'Bachelors'} />
                  <SpecItem label="Kitchen Facility" value={categoryDetails.kitchenAvailable ? 'Kitchen & Gas Allowed' : 'No Kitchen'} />
                  <SpecItem label="Water Supply" value={categoryDetails.waterSupply || '24/7 Water'} />
                </>
              )}
            </div>
          </div>

          {/* Amenities Grid */}
          {amenities.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '1.05rem', color: '#181e1b', fontWeight: 700, marginBottom: '10px' }}>
                Included Amenities
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {amenities.map((item, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      background: '#eaf3ed',
                      border: '1px solid #c2e2cc',
                      color: '#181e1b',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <CheckCircle2 size={14} color="#45855a" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '10px' }}>
            {onDelete && (
              <button
                onClick={() => onDelete(_id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Trash2 size={16} />
                <span>Delete Listing</span>
              </button>
            )}

            <button onClick={onClose} className="btn" style={{ padding: '10px 24px', background: '#181e1b', color: '#ffffff', borderRadius: '12px' }}>
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecItem({ label, value }) {
  return (
    <div style={{
      padding: '12px 14px',
      borderRadius: '12px',
      background: '#f8faf8',
      border: '1px solid #e2e8f0'
    }}>
      <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block', fontWeight: 500, marginBottom: '2px' }}>{label}</span>
      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#181e1b' }}>{value || 'N/A'}</span>
    </div>
  );
}
