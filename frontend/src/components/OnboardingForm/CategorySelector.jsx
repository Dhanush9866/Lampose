import React from 'react';
import { Home, Building, BedDouble, Key, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'PG',
    title: 'PG (Paying Guest)',
    shortTitle: 'PG',
    icon: Home,
    color: '#34d399',
    badgeClass: 'badge-pg',
    description: 'Shared & private rooms with food options & housekeeping.'
  },
  {
    id: 'Hostel',
    title: 'Hostel',
    shortTitle: 'Hostel',
    icon: Building,
    color: '#fca966',
    badgeClass: 'badge-hostel',
    description: 'Boys/Girls/Co-ed student hostels with mess canteen.'
  },
  {
    id: 'Dormitory',
    title: 'Dormitory',
    shortTitle: 'Dormitory',
    icon: BedDouble,
    color: '#67e8f9',
    badgeClass: 'badge-dormitory',
    description: 'Budget-friendly bunk bed pods with lockers.'
  },
  {
    id: 'Bachelor Room',
    title: 'Bachelor Room',
    shortTitle: 'Bachelor Flat',
    icon: Key,
    color: '#fbbf24',
    badgeClass: 'badge-bachelor',
    description: 'Independent 1RK/1BHK flats for bachelors.'
  }
];

export default function CategorySelector({ selectedCategory, onSelectCategory }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label className="form-label" style={{ fontSize: '0.95rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>Select Category *</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>(Choose category)</span>
      </label>

      <div className="category-selector-grid">
        {CATEGORIES.map((cat) => {
          const IconComp = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`category-card ${isSelected ? 'selected' : ''}`}
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-sm)',
                background: isSelected ? 'rgba(229, 126, 51, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: isSelected ? '2px solid #e57e33' : '1px solid var(--border-glass)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 4px 16px rgba(229, 126, 51, 0.25)' : 'none'
              }}
            >
              {isSelected && (
                <div className="category-check" style={{ position: 'absolute', top: '10px', right: '10px', color: '#e57e33' }}>
                  <CheckCircle2 size={18} />
                </div>
              )}

              <div className="category-card-body">
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: `${cat.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: cat.color,
                  flexShrink: 0
                }}>
                  <IconComp size={20} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {cat.title}
                    </h4>
                  </div>

                  <p className="category-desc" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.3', marginTop: '2px' }}>
                    {cat.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
