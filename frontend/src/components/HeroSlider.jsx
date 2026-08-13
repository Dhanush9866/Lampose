import React, { useState, useEffect } from 'react';
import { PlusCircle, MapPin, ShieldCheck, Heart, Sparkles, Clock, Calendar } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    tag: "INDIA'S ALL-IN-ONE URBAN LIVING PLATFORM",
    title: "More Choices. ",
    titleHighlight: "Better Experiences.",
    subtitle: "Top hostels, verified PGs & bachelor flats — ",
    subtitleHighlight: "all in one place.",
    buttonText: "Onboard Property",
    bgGradient: "linear-gradient(135deg, rgba(35, 88, 59, 0.95) 0%, rgba(19, 45, 30, 0.95) 100%)",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    features: [
      { icon: MapPin, title: "Top Locations", sub: "Near You" },
      { icon: ShieldCheck, title: "Verified Partners", sub: "You Can Trust" },
      { icon: Heart, title: "Great Reviews", sub: "Happy Customers" }
    ]
  },
  {
    id: 2,
    tag: "FLEXIBLE DURATION OPTIONS",
    title: "Short Stay or Long Stay? ",
    titleHighlight: "We Have Both.",
    subtitle: "List daily stays (1-7 days) or monthly accommodation — ",
    subtitleHighlight: "direct to tenants.",
    buttonText: "Onboard Short / Long Stay",
    bgGradient: "linear-gradient(135deg, rgba(229, 126, 51, 0.95) 0%, rgba(150, 70, 20, 0.95) 100%)",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    features: [
      { icon: Clock, title: "1 - 7 Days", sub: "Short Stay Rate" },
      { icon: Calendar, title: "1 Month+", sub: "Monthly Rent" },
      { icon: Sparkles, title: "0% Brokerage", sub: "Direct Enquiries" }
    ]
  },
  {
    id: 3,
    tag: "GROW YOUR ACCOMMODATION BUSINESS",
    title: "Onboard Your Property ",
    titleHighlight: "In 2 Minutes.",
    subtitle: "Join thousands of PG, Hostel, Dormitory & Bachelor Flat owners — ",
    subtitleHighlight: "fill details & go live instantly.",
    buttonText: "Start Onboarding Now",
    bgGradient: "linear-gradient(135deg, rgba(25, 60, 42, 0.95) 0%, rgba(229, 126, 51, 0.9) 100%)",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    features: [
      { icon: ShieldCheck, title: "Verified Owners", sub: "Trusted Platform" },
      { icon: Sparkles, title: "Fast Onboarding", sub: "Live in Minutes" },
      { icon: MapPin, title: "PAN India", sub: "Major Cities" }
    ]
  }
];

export default function HeroSlider({ onOnboardClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto rotate slides every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = SLIDES[currentIndex];

  return (
    <div 
      className="hero-slider-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        marginBottom: '24px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.15)'
      }}
    >
      {/* Slide Item Container */}
      <div 
        key={slide.id}
        className="animate-fade-in"
        style={{
          background: slide.bgGradient,
          padding: '32px 36px',
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          transition: 'all 0.5s ease'
        }}
      >
        {/* Background Image Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '50%',
          overflow: 'hidden',
          opacity: 0.2,
          maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, transparent 100%)',
          pointerEvents: 'none'
        }}>
          <img src={slide.image} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Top Tag & Main Title */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '4px 12px',
            borderRadius: '16px',
            marginBottom: '12px'
          }}>
            <Sparkles size={12} color="#ffffff" />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.04em' }}>
              {slide.tag}
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ maxWidth: '640px' }}>
              <h2 className="hero-slider-title" style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2.3rem)', fontWeight: 800, color: '#ffffff', lineHeight: '1.2' }}>
                {slide.title}
                <span style={{ color: slide.id === 2 ? '#ffffff' : '#e57e33' }}>{slide.titleHighlight}</span>
              </h2>

              <p className="hero-slider-sub" style={{ fontSize: '0.92rem', color: 'var(--text-sub)', marginTop: '6px' }}>
                {slide.subtitle}
                <strong style={{ color: '#ffffff' }}>{slide.subtitleHighlight}</strong>
              </p>
            </div>

            <button 
              onClick={onOnboardClick}
              className="btn btn-primary hero-slider-btn"
              style={{
                padding: '12px 26px',
                fontSize: '0.9rem',
                flexShrink: 0,
                background: '#e57e33',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(229, 126, 51, 0.4)'
              }}
            >
              <PlusCircle size={18} />
              <span>{slide.buttonText}</span>
            </button>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="hero-slider-features" style={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          paddingTop: '16px',
          marginTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          {slide.features.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0
                }}>
                  <IconComponent size={16} />
                </div>
                <div>
                  <strong style={{ display: 'block', color: '#ffffff', fontSize: '0.82rem', lineHeight: '1.2' }}>{feat.title}</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{feat.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide Indicators / Dots */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            style={{
              width: currentIndex === idx ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: currentIndex === idx ? '#e57e33' : 'rgba(255, 255, 255, 0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
}
