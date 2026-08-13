import React from 'react';
import { Search, Filter, Home, Building, BedDouble, Key, Layers } from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'All', label: 'All Categories', icon: Layers },
  { id: 'PG', label: 'PGs', icon: Home },
  { id: 'Hostel', label: 'Hostels', icon: Building },
  { id: 'Dormitory', label: 'Dormitories', icon: BedDouble },
  { id: 'Bachelor Room', label: 'Bachelor Rooms', icon: Key }
];

export default function FilterBar({ selectedCategory, onCategoryChange, searchTerm, onSearchChange, totalCount }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        background: 'rgba(255, 255, 255, 0.07)',
        backdropFilter: 'blur(12px)',
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-glass)'
      }}>
        {/* Search and Count Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search property name, location, owner..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '42px', height: '44px', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Filter size={15} />
            <span>Showing <strong style={{ color: '#ffffff' }}>{totalCount}</strong> Properties</span>
          </div>
        </div>

        {/* Category Tabs (Horizontally scrollable on phones) */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none'
        }}>
          {CATEGORY_TABS.map((tab) => {
            const IconComp = tab.icon;
            const isSelected = selectedCategory === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onCategoryChange(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '30px',
                  background: isSelected ? '#e57e33' : 'rgba(255, 255, 255, 0.1)',
                  color: isSelected ? '#ffffff' : 'var(--text-sub)',
                  border: isSelected ? 'none' : '1px solid var(--border-glass)',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  minHeight: '38px'
                }}
              >
                <IconComp size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
